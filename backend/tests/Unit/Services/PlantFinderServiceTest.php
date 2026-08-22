<?php

namespace Tests\Unit\Services;

use App\Models\PlantSpecies;
use App\Services\PlantFinderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Unit tests untuk PlantFinderService.
 * Mencakup: questions, scoring algorithm, recommendations.
 */
class PlantFinderServiceTest extends TestCase
{
    use RefreshDatabase;

    private PlantFinderService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PlantFinderService();
    }

    // ── Questions ──

    public function test_questions_returns_array(): void
    {
        $questions = $this->service->questions();

        $this->assertIsArray($questions);
        $this->assertCount(4, $questions);
    }

    public function test_questions_have_required_fields(): void
    {
        $questions = $this->service->questions();

        foreach ($questions as $question) {
            $this->assertArrayHasKey('id', $question);
            $this->assertArrayHasKey('question', $question);
            $this->assertArrayHasKey('options', $question);
            $this->assertIsArray($question['options']);

            foreach ($question['options'] as $option) {
                $this->assertArrayHasKey('value', $option);
                $this->assertArrayHasKey('label', $option);
            }
        }
    }

    // ── Recommend ──

    public function test_recommend_returns_up_to_3_results(): void
    {
        // Buat beberapa spesies
        PlantSpecies::factory()->count(5)->create();

        $results = $this->service->recommend([
            'lokasi' => 'indoor-terang',
            'pengalaman' => 'pemula',
            'tujuan' => 'hias',
            'waktu' => 'normal',
        ]);

        $this->assertIsArray($results);
        $this->assertLessThanOrEqual(3, count($results));
    }

    public function test_recommend_with_empty_database(): void
    {
        $results = $this->service->recommend([
            'lokasi' => 'indoor-terang',
        ]);

        $this->assertIsArray($results);
        $this->assertCount(0, $results);
    }

    // ── Scoring ──

    public function test_low_light_plants_score_higher_for_indoor_redup(): void
    {
        $sirih = PlantSpecies::factory()->create([
            'slug' => 'sirih-gading',
            'care_level' => 'mudah',
        ]);
        $cabai = PlantSpecies::factory()->create([
            'slug' => 'cabai-rawit',
            'care_level' => 'sedang',
        ]);

        $results = $this->service->recommend([
            'lokasi' => 'indoor-redup',
            'pengalaman' => 'pemula',
        ]);

        // Sirih gading harus di atas cabai karena cocok untuk indoor redup
        $slugs = array_map(fn ($r) => $r->slug, $results);
        $sirihPos = array_search('sirih-gading', $slugs);
        $cabaiPos = array_search('cabai-rawit', $slugs);

        if ($sirihPos !== false && $cabaiPos !== false) {
            $this->assertLessThan($cabaiPos, $sirihPos);
        }
    }

    public function test_edible_plants_score_higher_for_pangan(): void
    {
        $cabai = PlantSpecies::factory()->create([
            'slug' => 'cabai-rawit',
            'care_level' => 'sedang',
        ]);
        $monstera = PlantSpecies::factory()->create([
            'slug' => 'monstera-deliciosa',
            'care_level' => 'mudah',
        ]);

        $results = $this->service->recommend([
            'lokasi' => 'outdoor',
            'pengalaman' => 'sedang',
            'tujuan' => 'pangan',
        ]);

        $slugs = array_map(fn ($r) => $r->slug, $results);
        $cabaiPos = array_search('cabai-rawit', $slugs);
        $monsteraPos = array_search('monstera-deliciosa', $slugs);

        if ($cabaiPos !== false && $monsteraPos !== false) {
            $this->assertLessThan($monsteraPos, $cabaiPos);
        }
    }

    public function test_air_purifier_plants_score_higher_for_udara(): void
    {
        $lidah = PlantSpecies::factory()->create([
            'slug' => 'lidah-mertua',
            'care_level' => 'mudah',
        ]);
        $kaktus = PlantSpecies::factory()->create([
            'slug' => 'kaktus-mini',
            'care_level' => 'mudah',
        ]);

        $results = $this->service->recommend([
            'lokasi' => 'indoor-terang',
            'pengalaman' => 'pemula',
            'tujuan' => 'udara',
        ]);

        $slugs = array_map(fn ($r) => $r->slug, $results);
        $lidahPos = array_search('lidah-mertua', $slugs);
        $kaktusPos = array_search('kaktus-mini', $slugs);

        if ($lidahPos !== false && $kaktusPos !== false) {
            $this->assertLessThan($kaktusPos, $lidahPos);
        }
    }

    public function test_easy_care_plants_score_higher_for_busy_users(): void
    {
        $sirih = PlantSpecies::factory()->create([
            'slug' => 'sirih-gading',
            'care_level' => 'mudah',
        ]);
        $tomat = PlantSpecies::factory()->create([
            'slug' => 'tomat-cherry',
            'care_level' => 'sulit',
        ]);

        $results = $this->service->recommend([
            'lokasi' => 'indoor-terang',
            'pengalaman' => 'pemula',
            'waktu' => 'sibuk',
        ]);

        $slugs = array_map(fn ($r) => $r->slug, $results);
        $sirihPos = array_search('sirih-gading', $slugs);
        $tomatPos = array_search('tomat-cherry', $slugs);

        if ($sirihPos !== false && $tomatPos !== false) {
            $this->assertLessThan($tomatPos, $sirihPos);
        }
    }

    public function test_recommend_returns_species_objects(): void
    {
        PlantSpecies::factory()->create(['slug' => 'monstera-deliciosa']);

        $results = $this->service->recommend(['lokasi' => 'indoor-terang']);

        foreach ($results as $result) {
            $this->assertInstanceOf(PlantSpecies::class, $result);
        }
    }
}
