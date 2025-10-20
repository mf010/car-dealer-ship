<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    /** @use HasFactory<\Database\Factories\InvoiceFactory> */
    use HasFactory;

    protected $fillable = [
        
        'client_id',
        'account_id',
        'amount',
        'invoice_date',
        'car_id',
        'payed',
        'account_cut',
    ];
    public function client(){
        return $this->belongsTo(Client::class);
    }
    public function account(){
        return $this->belongsTo(Account::class);
    }

    public function car(){
        return $this->belongsTo(Car::class);
    }
    public function payments(){
        return $this->hasMany(Payment::class);
    }
}
