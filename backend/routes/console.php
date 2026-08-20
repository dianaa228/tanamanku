<?php

use App\Jobs\ProcessPlantReminder;
use Illuminate\Support\Facades\Schedule;

/*
|--------------------------------------------------------------------------
| Tanamanku scheduler (docs/14-notification.json)
|--------------------------------------------------------------------------
| Jalankan di server:  * * * * * cd /path/backend && php artisan schedule:run
| Dev Windows:         php artisan schedule:work
*/

// Cek & kirim pengingat perawatan yang jatuh tempo (setiap jam)
Schedule::job(new ProcessPlantReminder)->hourly();

// Update stok dari data product (sinkronisasi berkala)
Schedule::command('tanamanku:sync-inventory')->dailyAt('02:00');
