<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'phone',
        'personal_id',
        'address',
        'balance',
    ];
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

}
