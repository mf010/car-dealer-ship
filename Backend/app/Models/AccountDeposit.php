<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Filterable;

class AccountDeposit extends Model
{
    /** @use HasFactory<\Database\Factories\AccountDepositFactory> */
    use HasFactory, SoftDeletes, Filterable;
    
    protected $fillable = [
        'account_id',
        'amount',
        'deposit_date',
    ];

    public function account(){
        return $this->belongsTo(Account::class);
    }
}
