<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'role' => 'player',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'DJI Admin',
            'email' => 'admin@osmo.local',
            'password' => Hash::make('dji2026'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->call([
            TutorialSeeder::class,
            CommunityPostSeeder::class,
            SubmissionSeeder::class,
        ]);
    }
}
