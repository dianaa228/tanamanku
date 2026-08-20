<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceOrder extends Model
{
    protected $fillable = [
        'service_id', 'customer_id', 'schedule_at', 'address_snapshot',
        'status', 'total', 'note',
    ];

    protected function casts(): array
    {
        return [
            'schedule_at' => 'datetime',
            'address_snapshot' => 'array',
            'total' => 'decimal:2',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
