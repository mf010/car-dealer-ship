<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'balance',    
    ];
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
    public function accountWithdrawals()
    {
        return $this->hasMany(AccountWithdrawal::class);
    }

}
