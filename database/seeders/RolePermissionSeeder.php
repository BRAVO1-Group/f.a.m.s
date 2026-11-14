<?php


namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create the five roles
        $roles = [
            'student' => 'Student',
            'supervisor' => 'Supervisor',
            'org_admin' => 'Organization Administrator',
            'uni_admin' => 'University Administrator',
            'system_admin' => 'System Administrator',
        ];

        foreach ($roles as $slug => $name) {
            Role::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => $name . ' role',
                ]
            );
        }

        // 2. Define all thirteen permissions
        $permissions = [
            'logs:create' => [
                'name' => 'Create Logs',
                'description' => 'Create and submit activity logs',
                'category' => 'Logbooks & Activity Logging',
            ],
            'logs:approve' => [
                'name' => 'Approve Logs',
                'description' => 'Review and approve activity logs',
                'category' => 'Logbooks & Activity Logging',
            ],
            'logs:override' => [
                'name' => 'Override Logs',
                'description' => 'Override existing log decisions',
                'category' => 'Logbooks & Activity Logging',
            ],
            'attendance:record' => [
                'name' => 'Record Attendance',
                'description' => 'Record attendance entries',
                'category' => 'Attendance & Verification',
            ],
            'attendance:audit' => [
                'name' => 'Audit Attendance',
                'description' => 'Review and audit attendance records',
                'category' => 'Attendance & Verification',
            ],
            'milestones:track' => [
                'name' => 'Track Milestones',
                'description' => 'Track placement milestones',
                'category' => 'Milestones & Deliverables',
            ],
            'milestones:certify' => [
                'name' => 'Certify Milestones',
                'description' => 'Review and certify milestones',
                'category' => 'Milestones & Deliverables',
            ],
            'assessments:grade' => [
                'name' => 'Grade Assessments',
                'description' => 'Grade student assessments',
                'category' => 'Evaluations & Grading',
            ],
            'assessments:view_all' => [
                'name' => 'View All Assessments',
                'description' => 'View all student assessments',
                'category' => 'Evaluations & Grading',
            ],
            'supervisors:create' => [
                'name' => 'Create Supervisors',
                'description' => 'Create supervisor accounts',
                'category' => 'Supervisors & Placements',
            ],
            'supervisors:assign' => [
                'name' => 'Assign Supervisors',
                'description' => 'Assign supervisors to students',
                'category' => 'Supervisors & Placements',
            ],
            'rbac:manage' => [
                'name' => 'Manage RBAC',
                'description' => 'Manage roles and permissions',
                'category' => 'RBAC Governance & Access Control',
            ],
            'accreditation:export' => [
                'name' => 'Export Accreditation',
                'description' => 'Export accreditation reports',
                'category' => 'RBAC Governance & Access Control',
            ],
        ];

        foreach ($permissions as $slug => $details) {
            Permission::updateOrCreate(
                ['slug' => $slug],
                $details
            );
        }

        // 3. Assign permissions to each role
        $rolePermissions = [
            'student' => [
                'logs:create',
                'attendance:record',
                'milestones:track',
            ],

            'supervisor' => [
                'logs:approve',
                'attendance:audit',
                'milestones:track',
                'milestones:certify',
                'assessments:grade',
            ],

            'org_admin' => [
                'logs:approve',
                'attendance:audit',
                'milestones:certify',
                'assessments:grade',
                'supervisors:create',
            ],

            'uni_admin' => [
                'logs:approve',
                'logs:override',
                'attendance:audit',
                'milestones:certify',
                'assessments:grade',
                'assessments:view_all',
                'supervisors:create',
                'supervisors:assign',
                'rbac:manage',
                'accreditation:export',
            ],

            'system_admin' => [
                'logs:create',
                'logs:approve',
                'logs:override',
                'attendance:record',
                'attendance:audit',
                'milestones:track',
                'milestones:certify',
                'assessments:grade',
                'assessments:view_all',
                'supervisors:create',
                'supervisors:assign',
                'rbac:manage',
                'accreditation:export',
            ],
        ];

        foreach ($rolePermissions as $roleSlug => $permissionSlugs) {
            $role = Role::where('slug', $roleSlug)->firstOrFail();

            $permissionIds = Permission::whereIn(
                'slug',
                $permissionSlugs
            )->pluck('id');

            $role->permissions()->sync($permissionIds);
        }
    }
}