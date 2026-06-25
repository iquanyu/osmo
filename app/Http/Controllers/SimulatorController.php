<?php

namespace App\Http\Controllers;

use App\Services\SpecsService;
use Inertia\Inertia;
use Inertia\Response;

class SimulatorController extends Controller
{
    public function index(): Response
    {
        $specsService = app(SpecsService::class);

        return Inertia::render('simulator/index', [
            'creatorPresets' => $specsService->getCreatorPresets(),
            'generalSpecs' => $specsService->getGeneralSpecs(),
        ]);
    }
}
