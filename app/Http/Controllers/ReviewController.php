<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Display logbooks the authenticated reviewer is allowed to access.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $this->authorizeReview($user);

        $logbooks = $this->visibleLogbooks($user)
            ->latest('log_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Review/Index', [
            'logbooks' => $logbooks,
        ]);
    }

    /**
     * Display one logbook submission.
     */
    public function show(Request $request, Logbook $logbook): Response
    {
        $user = $request->user();

        $this->authorizeReview($user);

        $logbook = $this->visibleLogbooks($user)
            ->whereKey($logbook->id)
            ->firstOrFail();

        return Inertia::render('Review/Show', [
            'logbook' => $logbook,
        ]);
    }

    /**
     * Approve a submitted logbook.
     */
    public function approve(Request $request, Logbook $logbook)
    {
        $user = $request->user();

        $this->authorizeReview($user);

        $logbook = $this->visibleLogbooks($user)
            ->whereKey($logbook->id)
            ->firstOrFail();

        abort_unless($logbook->status === 'submitted', 422,
            'Only submitted logbooks can be approved.'
        );

        $logbook->update([
            'status' => 'approved',
        ]);

        return back()->with('success', 'Logbook approved successfully.');
    }

    /**
     * Return a submitted logbook to the student for correction.
     */
    public function returnForCorrection(Request $request, Logbook $logbook)
    {
        $user = $request->user();

        $this->authorizeReview($user);

        $logbook = $this->visibleLogbooks($user)
            ->whereKey($logbook->id)
            ->firstOrFail();

        abort_unless($logbook->status === 'submitted', 422,
            'Only submitted logbooks can be returned.'
        );

        $logbook->update([
            'status' => 'draft',
        ]);

        return back()->with('success', 'Logbook returned for correction.');
    }

    /**
     * Verify that the user has the logs:approve permission.
     */
    private function authorizeReview(User $user): void
    {
        $hasPermission = $user->roles()
            ->whereHas('permissions', function ($query) {
                $query->where('slug', 'logs:approve');
            })
            ->exists();

        abort_unless($hasPermission, 403, 'You are not allowed to review logbooks.');
    }

    /**
     * Return only logbooks within the reviewer's permitted scope.
     */
    private function visibleLogbooks(User $user): Builder
    {
        $role = $user->roles()->first()?->slug;

        $query = Logbook::with([
            'placement.student.user',
            'placement.student.program.department',
            'placement.organization',
            'placement.supervisor.user',
        ]);

        switch ($role) {
            case 'supervisor':

                $supervisorId = $user->supervisor()->value('id');

                if (!$supervisorId) {
                    return $query->whereRaw('1 = 0');
                }

                $query->whereHas('placement', function ($placementQuery) use ($supervisorId) {
                    $placementQuery->where('supervisor_id', $supervisorId);
                });

                break;

            case 'org_admin':

                if (!$user->organization_id) {
                    return $query->whereRaw('1 = 0');
                }

                $query->whereHas('placement', function ($placementQuery) use ($user) {
                    $placementQuery->where('organization_id', $user->organization_id);
                });

                break;

            case 'uni_admin':

                if (!$user->university_id) {
                    return $query->whereRaw('1 = 0');
                }

                $query->whereHas(
                    'placement.student.program.department',
                    function ($departmentQuery) use ($user) {
                        $departmentQuery->where('university_id', $user->university_id);
                    }
                );

                break;

            case 'system_admin':

                // System administrators can access all logbooks.
                break;

            default:

                abort(403, 'You are not allowed to review logbooks.');
        }

        return $query;
    }
}