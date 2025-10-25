<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Filterable;

class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory, SoftDeletes, Filterable;
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
