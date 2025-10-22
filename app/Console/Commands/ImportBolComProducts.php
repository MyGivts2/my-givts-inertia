<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ImportBolComProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:bol-com-products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->importFromFile('daily_care.json', 'Verzorging');
    }

    public function importFromFile($fileName, $category)
    {
        $filePath = "bol.com/$fileName";

        if (!Storage::disk('local')->exists($filePath)) {
            logger("File not found at path: $filePath");
        } else {
            try {
                $jsonContent = Storage::disk('local')->get($filePath);
                $data = json_decode($jsonContent, true);
                foreach ($data as $item) {
                    Product::create([
                        'name' => $item['title'],
                        'gender' => 'unisex',
                        'category' => $category,
                        'description' => $item['description'],
                        'image_url' => $item['imageUrl'],
                        'product_url' => $item['productPageUrlNL'],
                        'price' => $item['OfferNL.sellingPrice'],
                        'vendor' => 'bol.com',
                    ]);
                }
            } catch (\JsonException $e) {
                logger("JSON decode error: " . $e->getMessage());
            }
        }
    }
}
