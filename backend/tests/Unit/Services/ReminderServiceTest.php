<?php

namespace Tests\Unit\Services;

use App\Models\PlantReminder;
use App\Models\PlantSpecies;
use App\Models\User;
use App\Models\UserPlant;
use App\Services\ReminderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Unit tests untuk ReminderService.
 * Mencakup: dueReminders, markDone, reschedule, store.
 */
class ReminderServiceTest extends TestCase
{
    use RefreshDatabase;

    private ReminderService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ReminderService();
    }

    private function createPlantWithReminder(array $reminderOverrides = []): array
    {
        $user = User::factory()->create();
        $species = PlantSpecies::factory()->create();
        $plant = UserPlant::factory()->create([
            'user_id' => $user->id,
            'plant_species_id' => $species->id,
        ]);

        $reminder = PlantReminder::factory()->create(array_merge([
            'user_plant_id' => $plant->id,
            'type' => 'siram',
            'frequency_days' => 3,
            'next_due_at' => now()->subDay(),
            'is_active' => true,
        ], $reminderOverrides));

        return compact('user', 'plant', 'reminder');
    }

    // ── Due Reminders ──

    public function test_due_reminders_returns_overdue(): void
    {
        $this->createPlantWithReminder([
            'next_due_at' => now()->subDay(),
            'is_active' => true,
        ]);

        $due = $this->service->dueReminders();

        $this->assertCount(1, $due);
    }

    public function test_due_reminders_excludes_future(): void
    {
        $this->createPlantWithReminder([
            'next_due_at' => now()->addDays(5),
            'is_active' => true,
        ]);

        $due = $this->service->dueReminders();

        $this->assertCount(0, $due);
    }

    public function test_due_reminders_excludes_inactive(): void
    {
        $this->createPlantWithReminder([
            'next_due_at' => now()->subDay(),
            'is_active' => false,
        ]);

        $due = $this->service->dueReminders();

        $this->assertCount(0, $due);
    }

    // ── Mark Done ──

    public function test_mark_done_updates_last_done_at(): void
    {
        ['reminder' => $reminder] = $this->createPlantWithReminder();

        $result = $this->service->markDone($reminder);

        $this->assertNotNull($result->last_done_at);
    }

    public function test_mark_done_reschedules(): void
    {
        ['reminder' => $reminder] = $this->createPlantWithReminder([
            'frequency_days' => 7,
        ]);

        $result = $this->service->markDone($reminder);

        $this->assertTrue($result->next_due_at->isAfter(now()));
    }

    public function test_mark_done_creates_care_log(): void
    {
        ['plant' => $plant, 'reminder' => $reminder] = $this->createPlantWithReminder([
            'type' => 'siram',
        ]);

        $this->service->markDone($reminder);

        $this->assertDatabaseHas('plant_care_logs', [
            'user_plant_id' => $plant->id,
            'type' => 'siram',
        ]);
    }

    // ── Reschedule ──

    public function test_reschedule_sets_next_due(): void
    {
        ['reminder' => $reminder] = $this->createPlantWithReminder([
            'frequency_days' => 5,
        ]);

        $before = now();
        $result = $this->service->reschedule($reminder);
        $after = now();

        $this->assertTrue($result->next_due_at->isAfter($before));
        $this->assertTrue($result->next_due_at->lte($after->addDays(6)));
    }

    // ── Store ──

    public function test_store_creates_reminder(): void
    {
        ['plant' => $plant] = $this->createPlantWithReminder();

        $reminder = $this->service->store($plant, [
            'type' => 'pupuk',
            'frequency_days' => 14,
        ]);

        $this->assertEquals('pupuk', $reminder->type);
        $this->assertEquals(14, $reminder->frequency_days);
        $this->assertTrue($reminder->is_active);
        $this->assertTrue($reminder->next_due_at->isAfter(now()));
    }

    public function test_store_sets_next_due_from_now(): void
    {
        ['plant' => $plant] = $this->createPlantWithReminder();

        $before = now();
        $reminder = $this->service->store($plant, [
            'type' => 'siram',
            'frequency_days' => 3,
        ]);

        $this->assertTrue($reminder->next_due_at->isAfter($before));
        $this->assertTrue($reminder->next_due_at->lte($before->addDays(4)));
    }
}
