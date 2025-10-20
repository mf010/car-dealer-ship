<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\AccountWithdrawalController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CarExpenseController;
use App\Http\Controllers\CarModelController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DealerShipExpenseController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MakeController;
use App\Http\Controllers\PaymentController;

Route::post('login', [AuthController::class, 'login']);
Route::delete('users/{id}', [AuthController::class, 'deleteUser']);
Route::put('users/{id}', [AuthController::class, 'updateUser']);
Route::post('register', [AuthController::class, 'register']);
Route::get('me', [AuthController::class, 'me']);
Route::post('logout', [AuthController::class, 'logout']);
Route::post('refresh', [AuthController::class, 'refresh']);
Route::get('users', [AuthController::class, 'index']);

Route::apiResource('accounts', AccountController::class);
Route::apiResource('account-withdrawals', AccountWithdrawalController::class);
Route::apiResource('cars', CarController::class);
Route::apiResource('car-expenses', CarExpenseController::class);
Route::apiResource('car-models', CarModelController::class);
Route::apiResource('clients', ClientController::class);
Route::apiResource('dealership-expenses', DealerShipExpenseController::class);
Route::apiResource('invoices', InvoiceController::class);
Route::apiResource('makes', MakeController::class);
Route::apiResource('payments', PaymentController::class);


Route::group(['middleware' => 'auth:api'], function () {

});


Route::prefix('deleted')->group(function () {
    Route::get('accounts', [AccountController::class, 'indexDeleted']);
    Route::post('accounts/{id}/restore', [AccountController::class, 'undelete']);
    
    Route::get('account-withdrawals', [AccountWithdrawalController::class, 'indexDeleted']);
    Route::post('account-withdrawals/{id}/restore', [AccountWithdrawalController::class, 'undelete']);
    
    Route::get('cars', [CarController::class, 'indexDeleted']);
    Route::post('cars/{id}/restore', [CarController::class, 'undelete']);
    
    Route::get('car-expenses', [CarExpenseController::class, 'indexDeleted']);
    Route::post('car-expenses/{id}/restore', [CarExpenseController::class, 'undelete']);
    
    Route::get('car-models', [CarModelController::class, 'indexDeleted']);
    Route::post('car-models/{id}/restore', [CarModelController::class, 'undelete']);
    
    Route::get('clients', [ClientController::class, 'indexDeleted']);
    Route::post('clients/{id}/restore', [ClientController::class, 'undelete']);
    
    Route::get('dealership-expenses', [DealerShipExpenseController::class, 'indexDeleted']);
    Route::post('dealership-expenses/{id}/restore', [DealerShipExpenseController::class, 'undelete']);
    
    Route::get('invoices', [InvoiceController::class, 'indexDeleted']);
    Route::post('invoices/{id}/restore', [InvoiceController::class, 'undelete']);
    
    Route::get('makes', [MakeController::class, 'indexDeleted']);
    Route::post('makes/{id}/restore', [MakeController::class, 'undelete']);
    
    Route::get('payments', [PaymentController::class, 'indexDeleted']);
    Route::post('payments/{id}/restore', [PaymentController::class, 'undelete']);
});