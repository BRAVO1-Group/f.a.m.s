<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Organization;


class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            return;
        }

        $organizations = [
            [
                'name' => 'Kampala Tech Solutions',
                'registration_number' => 'DEMO-ORG-001',
                'industry' => 'Information Technology',
                'email' => 'info@kampalatech.test',
                'phone' => '0701000001',
                'website' => 'https://kampalatech.test',
                'address' => 'Kampala, Uganda',
                'status' => 'active',
            ],
            [
                'name' => 'Greenfield Agro Services',
                'registration_number' => 'DEMO-ORG-002',
                'industry' => 'Agriculture',
                'email' => 'info@greenfield.test',
                'phone' => '0701000002',
                'website' => null,
                'address' => 'Wakiso, Uganda',
                'status' => 'active',
            ],
            [
                'name' => 'Bright Future Foundation',
                'registration_number' => 'DEMO-ORG-003',
                'industry' => 'Non-governmental Organization',
                'email' => 'info@brightfuture.test',
                'phone' => '0701000003',
                'website' => null,
                'address' => 'Entebbe, Uganda',
                'status' => 'active',
            ],
        ];

        foreach ($organizations as $data) {
            Organization::updateOrCreate(
                ['registration_number' => $data['registration_number']],
                $data
            );
        }
    }
}
