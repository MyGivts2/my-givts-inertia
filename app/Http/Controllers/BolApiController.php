<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class BolApiController extends Controller
{
    protected string $clientId;
    protected string $clientSecret;
    protected string $tokenUrl;
    protected string $apiUrl;

    public function __construct()
    {
        $this->clientId = config('services.bol.client_id');
        $this->clientSecret = config('services.bol.client_secret');
        $this->tokenUrl = config('services.bol.token_url');
        $this->apiUrl = config('services.bol.api_url');
    }

    public function getAccessToken(): ?string
    {
        return Cache::remember('bol_access_token', 240, function () {
            $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
                ->withHeaders([
                    'Accept' => 'application/json',
                    'Content-Length' => 0,
                ])
                ->post($this->tokenUrl);

            if ($response->successful()) {
                return $response->json()['access_token'];
            }

            return null;
        });
    }

    public function getProductByEan(string $ean, string $country = 'NL')
    {
        $token = $this->getAccessToken();

        if (!$token) {
            throw new \Exception('Could not retrieve access token.');
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'Accept' => 'application/json',
            'Accept-Language' => 'nl',
        ])->get("{$this->apiUrl}/{$ean}", [
            'country-code' => $country,
            // 'include-specifications	' => 'true',
            'include-image' => 'true',
            'include-offer' => 'true',
            'include-rating' => 'true',
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception("API call failed: " . $response->status());
    }
}
