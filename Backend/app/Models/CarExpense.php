<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarExpense extends Model
{
    /** @use HasFactory<\Database\Factories\CarExpenseFactory> */
    use HasFactory;

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
