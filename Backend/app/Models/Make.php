<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Filterable;

class Make extends Model
{
    /** @use HasFactory<\Database\Factories\MakeFactory> */
    use HasFactory, SoftDeletes, Filterable;

    protected $fillable = [
        'name',

    ];
    
    public function carModels()
    {
        return $this->hasMany(CarModel::class);
    }
}
