<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicSimulatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_simulator_index_includes_specs_and_presets(): void
    {
        $response = $this->get(route('simulator'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('simulator/index')
            ->has('creatorPresets')
            ->has('generalSpecs')
        );
    }
}
