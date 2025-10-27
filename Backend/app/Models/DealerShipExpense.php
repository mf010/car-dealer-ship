<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Filterable;

class DealerShipExpense extends Model
{
    /** @use HasFactory<\Database\Factories\DealerShipExpenseFactory> */
    use HasFactory, SoftDeletes, Filterable;

    protected $fillable = [
        'description',
        'amount',
        'expense_date',
    ];
}
