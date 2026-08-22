<?php

namespace Tests\Unit\Services;

use App\Models\PlantSpecies;
use App\Models\User;
use App\Models\UserPlant;
use App\Services\PlantDiagnosisService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Unit tests untuk PlantDiagnosisService.
 * Mencakup: symptoms list, rule matching, diagnosis edge cases.
 */
class PlantDiagnosisServiceTest extends TestCase
{
    use RefreshDatabase;

    private PlantDiagnosisService $service;
    private UserPlant $plant;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PlantDiagnosisService();

        $user = User::factory()->create();
        $species = PlantSpecies::factory()->create();
        $this->plant = UserPlant::factory()->create([
            'user_id' => $user->id,
            'plant_species_id' => $species->id,
        ]);
    }

    // ── Symptoms ──

    public function test_symptoms_returns_array(): void
    {
        $symptoms = $this->service->symptoms();

        $this->assertIsArray($symptoms);
        $this->assertNotEmpty($symptoms);
    }

    public function test_symptoms_have_required_fields(): void
    {
        $symptoms = $this->service->symptoms();

        foreach ($symptoms as $symptom) {
            $this->assertArrayHasKey('id', $symptom);
            $this->assertArrayHasKey('label', $symptom);
        }
    }

    // ── Diagnosis ──

    public function test_diagnose_overwatering(): void
    {
        $result = $this->service->diagnose($this->plant, [
            'daun-kuning',
            'daun-layu',
            'tanah-basah',
        ]);

        $this->assertEquals($this->plant->id, $result->user_plant_id);
        $this->assertStringContainsString('Overwatering', $result->diagnosis);
        $this->assertEquals('sedang', $result->severity);
        $this->assertIsArray($result->advice);
        $this->assertNotEmpty($result->advice);
    }

    public function test_diagnose_underwatering(): void
    {
        $result = $this->service->diagnose($this->plant, [
            'daun-kering',
            'ujung-coklat',
            'daun-menggulung',
        ]);

        $this->assertStringContainsString('Kekurangan Air', $result->diagnosis);
        $this->assertEquals('sedang', $result->severity);
    }

    public function test_diagnose_fungus(): void
    {
        $result = $this->service->diagnose($this->plant, [
            'bercak-putih',
            'serbuk-putih',
            'daun-keriting',
        ]);

        $this->assertStringContainsString('Jamur', $result->diagnosis);
        $this->assertEquals('berat', $result->severity);
    }

    public function test_diagnose_pests(): void
    {
        $result = $this->service->diagnose($this->plant, [
            'lubang-daun',
            'kutu-hijau',
        ]);

        $this->assertStringContainsString('Hama', $result->diagnosis);
        $this->assertEquals('berat', $result->severity);
    }

    public function test_diagnose_nutrient_deficiency(): void
    {
        $result = $this->service->diagnose($this->plant, [
            'daun-pucat',
            'pertumbuhan-lambat',
            'daun-kuning-bawah',
        ]);

        $this->assertStringContainsString('Nutrisi', $result->diagnosis);
        $this->assertEquals('ringan', $result->severity);
    }

    public function test_diagnose_no_match(): void
    {
        $result = $this->service->diagnose($this->plant, [
            'gejala-tidak-dikenal',
        ]);

        $this->assertStringContainsString('belum cukup spesifik', $result->diagnosis);
        $this->assertEquals('ringan', $result->severity);
    }

    public function test_diagnose_empty_symptoms(): void
    {
        $result = $this->service->diagnose($this->plant, []);

        $this->assertStringContainsString('belum cukup spesifik', $result->diagnosis);
    }

    public function test_diagnose_saves_to_database(): void
    {
        $this->service->diagnose($this->plant, [
            'daun-kuning',
            'daun-layu',
        ]);

        $this->assertDatabaseHas('plant_diagnoses', [
            'user_plant_id' => $this->plant->id,
        ]);
    }

    public function test_diagnose_best_match_wins(): void
    {
        // Gejala yang cocok dengan 2 aturan berbeda
        // overwatering: daun-kuning, daun-layu, tanah-basah (3 match)
        // nutrisi: daun-pucat, pertumbuhan-lambat, daun-kuning-bawah (0 match)
        $result = $this->service->diagnose($this->plant, [
            'daun-kuning',
            'daun-layu',
            'tanah-basah',
        ]);

        $this->assertStringContainsString('Overwatering', $result->diagnosis);
    }

    public function test_diagnose_multiple_symptoms_partial_match(): void
    {
        // Gejala campuran: 2 dari overwatering, 1 dari hama
        $result = $this->service->diagnose($this->plant, [
            'daun-kuning',
            'daun-layu',
            'lubang-daun',
        ]);

        // overwatering punya 2 match, hama punya 1 match → overwatering menang
        $this->assertStringContainsString('Overwatering', $result->diagnosis);
    }
}
