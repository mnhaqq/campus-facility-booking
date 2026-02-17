<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Booking;
use App\Models\Facility;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Facility::create([
            'name' => 'Conference Hall A',
            'location' => 'Main Campus',
            'capacity' => 100
        ]);

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);

        Booking::create([
            'facility_id' => 1,
            'user_id' => 1,
            'date' => '2026-02-20',
            'start_time' => '10:00:00',
            'end_time' => '12:00:00',
            'status' => 'confirmed'
        ]);
    }
}
