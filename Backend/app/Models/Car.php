<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Filterable;

class Car extends Model
{
    /** @use HasFactory<\Database\Factories\CarFactory> */
    use HasFactory, SoftDeletes, Filterable;

    protected $fillable = [
        'name',
        'car_model_id',
        'account_id',//dealer
        'status',
        'purchase_price',
        'total_expenses',
    ];
    
    public function carModel()
    {
        return $this->belongsTo(CarModel::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
    
    public function expenses()
    {
        return $this->hasMany(CarExpense::class);
    }

}
