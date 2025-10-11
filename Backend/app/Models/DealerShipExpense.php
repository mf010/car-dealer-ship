<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DealerShipExpense extends Model
{
    /** @use HasFactory<\Database\Factories\DealerShipExpenseFactory> */
    use HasFactory;

    protected $fillable = [
        'description',
        'amount',
        'expense_date',
    ];
}
