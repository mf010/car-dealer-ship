<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Filterable;

class AccountWithdrawal extends Model
{
    /** @use HasFactory<\Database\Factories\AccountWithdrawalFactory> */
    use HasFactory, SoftDeletes, Filterable;
    protected $fillable = [
        'account_id',
        'amount',
        'withdrawal_date',
    ];

    public function account(){
        return $this->belongsTo(Account::class);
    }
}
