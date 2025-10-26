<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Filterable;

class Invoice extends Model
{
    /** @use HasFactory<\Database\Factories\InvoiceFactory> */
    use HasFactory, SoftDeletes, Filterable;

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

    /**
     * Scope to filter invoices by paid status
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param mixed $status - true/1/"true" for fully paid, false/0/"false" for unpaid
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePaid($query, $status)
    {
        // Convert string boolean to actual boolean
        if (is_string($status)) {
            $status = filter_var($status, FILTER_VALIDATE_BOOLEAN);
        }

        if ($status) {
            // Fully paid: payed >= amount
            return $query->whereRaw('payed >= amount');
        } else {
            // Unpaid or partially paid: payed < amount
            return $query->whereRaw('payed < amount');
        }
    }

    /**
     * Check if invoice is fully paid
     * 
     * @return bool
     */
    public function getIsPaidAttribute()
    {
        return $this->payed >= $this->amount;
    }
}
