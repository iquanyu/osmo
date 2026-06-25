<?php

namespace App\Http\Controllers;

use App\Services\AssistantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssistantController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('assistant/index');
    }

    public function suggest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'scenario' => 'required|string|min:1',
        ]);

        $service = app(AssistantService::class);
        $suggestion = $service->getSuggestion($validated['scenario']);

        return response()->json($suggestion);
    }
}
