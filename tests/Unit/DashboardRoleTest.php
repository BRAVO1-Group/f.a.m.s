<?php

namespace Tests\Unit;

use App\Http\Controllers\DashboardController;
use PHPUnit\Framework\TestCase;

class DashboardRoleTest extends TestCase
{
    public function test_primary_role_matches_frontend_precedence_for_multi_role_users(): void
    {
        $this->assertSame(
            'system_admin',
            DashboardController::primaryRole(['uni_admin', 'system_admin'])
        );
    }
}
