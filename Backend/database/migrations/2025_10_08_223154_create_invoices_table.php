<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients');
            $table->foreignId('account_id')->constrained('accounts')->nullable();//dealer
            $table->decimal('amount', 10, 2);
            $table->date('invoice_date');
            $table->foreignId('car_id')->constrained('cars');
            $table->decimal('payed', 10, 2);
            $table->decimal('account_cut', 10, 2);// dealer cut
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
