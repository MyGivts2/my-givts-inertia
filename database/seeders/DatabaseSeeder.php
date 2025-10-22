<?php

namespace Database\Seeders;

use App\Models\Prompt;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        Prompt::create([
            'prompt_text' => <<<EOT
You are a gift recommendation assistant.
User Profile:
{userProfile}

Available Products:
{productData}
Based on the user's profile and the available products, recommend the 10 most suitable gift(s) and explain why.
EOT,
        ]);
    }
}
