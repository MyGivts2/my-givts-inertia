<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-API-Key') ?? $request->query('api_key');
        $expectedApiKey = env('API_KEY');

        if (!$apiKey || !$expectedApiKey || $apiKey !== $expectedApiKey) {
            return response()->json([
                'message' => 'Unauthorized. Invalid or missing API key.'
            ], 401);
        }

        return $next($request);
    }
}
