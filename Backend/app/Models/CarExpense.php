<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Filterable;

class CarExpense extends Model
{
    /** @use HasFactory<\Database\Factories\CarExpenseFactory> */
    use HasFactory, SoftDeletes, Filterable;

    protected $fillable = [
        'car_id',
        'description',
        'amount',
        'expense_date',
    ];
    public function car(){
        return $this->belongsTo(Car::class);
    }
}
