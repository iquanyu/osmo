<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicToolsTest extends TestCase
{
    use RefreshDatabase;

    public function test_tools_index_renders(): void
    {
        $response = $this->get(route('tools.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('tools/index'));
    }

    public function test_nd_calculator_page_renders(): void
    {
        $response = $this->get(route('tools.nd-calculator'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('tools/nd-calculator'));
    }

    public function test_specs_page_renders_with_profiles(): void
    {
        $response = $this->get(route('tools.specs'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('tools/specs')
            ->has('profiles')
            ->has('profiles.0')
            ->where('profiles.0.platform', 'Bilibili/YouTube')
        );
    }

    public function test_accessories_page_renders(): void
    {
        $response = $this->get(route('tools.accessories'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('tools/accessories')
            ->has('accessories')
            ->has('communityPosts')
            ->where('accessories.0.recommendation', '推荐')
            ->has('communityPosts.0.title')
        );
    }
}
