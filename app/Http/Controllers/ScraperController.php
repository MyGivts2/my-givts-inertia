<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ScraperController extends Controller
{
    public function index()
    {
        $url = "https://www.bol.com/nl/nl/p/philips-oneblade-pro-360-face-body-zwart-trimmer-scheerapparaat-en-styler-in-1-qp6542-15/9300000182633578/?promo=brandcampaign_120_Philips-OneBlade-Pro-360-Face-Body-Zwart-Trimmer-scheerapparaat-en-styler-in-1-QP654215_5_Philips-OneBlade-Pro-360-Face-Body-Zwart-Trimmer-scheerapparaat-en-styler-in-1-QP654215_0_9300000182633578_&bltgh=af8e25b4-f097-4f0b-9759-e503dbfdb40d.catalogSlotGroup_5_catalogGroup_2_catalogProductGridGroup_2.catalogProductGridItem_2.ProductImage";
        $scriptPath = base_path('resources/scripts/test.js');
        $command = escapeshellcmd("node $scriptPath " . escapeshellarg($url));
        $output = shell_exec($command);
        logger($output);
        return [
            'output' => $output
        ];
    }
}
