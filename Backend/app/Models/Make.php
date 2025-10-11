<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Make extends Model
{
    /** @use HasFactory<\Database\Factories\MakeFactory> */
    use HasFactory;

    protected $fillable = [
        'name',

    ];
    
    public function carModels()
    {
        return $this->hasMany(CarModel::class);
    }
}
