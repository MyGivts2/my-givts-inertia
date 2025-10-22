<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ParseOpenaiBatchResults extends Command
{
    protected $signature = 'openai:parse-batch {--filename=batch_output.jsonl : JSONL file from OpenAI batch output}';

    protected $description = 'Parse OpenAI batch output from a .jsonl file in storage/app into a structured .json file';

    public function handle()
    {
        $filename = $this->option('filename');

        if (!Storage::exists($filename)) {
            $this->error("❌ File not found: storage/app/{$filename}");
            return;
        }

        $this->info("📂 Reading file: {$filename}");
        $response = Storage::get($filename);

        $lines = explode("\n", trim($response));
        $results = [];

        foreach ($lines as $line) {
            $parsed = json_decode($line, true);
            logger($parsed); // Log the parsed line for debugging
            if (!$parsed) continue;

            $customId = $parsed['custom_id'] ?? null;
            $content = $parsed['response']['body']['choices'][0]['message']['content'] ?? null;

            if ($customId && $content) {
                $decoded = json_decode($content, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    $results[$customId] = $decoded;
                } else {
                    logger()->warning("⚠️ Could not decode content for {$customId}");
                    $results[$customId] = $content; // fallback as raw string
                }
            }
        }

        $parsedName = 'parsed_' . pathinfo($filename, PATHINFO_FILENAME) . '.json';
        Storage::put($parsedName, json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $this->info("✅ Parsed output saved: storage/app/{$parsedName}");
    }
}
