<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Filterable;

class CarModel extends Model
{
    /** @use HasFactory<\Database\Factories\CarModelFactory> */
    use HasFactory, SoftDeletes, Filterable;
    protected $fillable = [
        'name',
        'make_id',
    ];
    public function make()
    {
        return $this->belongsTo(Make::class);
    }
    public function cars()
    {
        return $this->hasMany(Car::class);
    }
}
