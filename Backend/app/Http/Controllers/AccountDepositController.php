<?php

namespace App\Http\Controllers;

use App\Models\AccountDeposit;
use App\Http\Requests\AccountDepositRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountDepositController extends Controller
{
    // List all account deposits with pagination and filtering
    public function index(Request $request)
    {
        $query = AccountDeposit::with('account');
        
        // Support both filters[field] and direct field parameters
        if ($request->has('filters')) {
            $query->filter($request->filters);
        } else {
            // Support direct query parameters like ?amount_from=1&amount_to=2
            $directFilters = $request->except(['page', 'per_page']);
            if (!empty($directFilters)) {
                $query->filter($directFilters);
            }
        }
        
        return response()->json($query->paginate(10));
    }

    // Store a new account deposit
    public function store(AccountDepositRequest $request)
    {
        // Use database transaction to ensure data consistency
        DB::beginTransaction();
        
        try {
            $deposit = AccountDeposit::create([
                'account_id' => $request->account_id,
                'amount' => $request->amount,
                'deposit_date' => $request->deposit_date,
            ]);

            // Add deposit amount to account balance
            app(AccountController::class)->AddToAccountBalance($request->account_id, new Request([
                'amount' => $request->amount
            ]));

            DB::commit();
            
            // Load the account relationship for the response
            return response()->json($deposit->load('account'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Show a single account deposit
    public function show($id)
    {
        $deposit = AccountDeposit::with('account')->findOrFail($id);
        return response()->json($deposit);
    }

    // Update an account deposit
    public function update(AccountDepositRequest $request, $id)
    {
        // Use database transaction to ensure data consistency
        DB::beginTransaction();
        
        try {
            $deposit = AccountDeposit::findOrFail($id);
            
            $oldAmount = $deposit->amount;
            $oldAccountId = $deposit->account_id;

            $deposit->update([
                'account_id' => $request->account_id,
                'amount' => $request->amount,
                'deposit_date' => $request->deposit_date,
            ]);

            // Handle account balance changes
            if ($oldAccountId == $request->account_id) {
                // Same account, just adjust the difference
                $difference = $request->amount - $oldAmount;
                if ($difference > 0) {
                    // New amount is higher, add more to account
                    app(AccountController::class)->AddToAccountBalance($request->account_id, new Request([
                        'amount' => $difference
                    ]));
                } elseif ($difference < 0) {
                    // New amount is lower, subtract from account
                    app(AccountController::class)->SubtractFromAccountBalance($request->account_id, new Request([
                        'amount' => abs($difference)
                    ]));
                }
            } else {
                // Different account - subtract old amount from old account and add new amount to new account
                app(AccountController::class)->SubtractFromAccountBalance($oldAccountId, new Request([
                    'amount' => $oldAmount
                ]));
                app(AccountController::class)->AddToAccountBalance($request->account_id, new Request([
                    'amount' => $request->amount
                ]));
            }

            DB::commit();
            
            // Load the account relationship for the response
            return response()->json($deposit->load('account'));
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Delete an account deposit
    public function destroy($id)
    {
        // Use database transaction to ensure data consistency
        DB::beginTransaction();
        
        try {
            $deposit = AccountDeposit::findOrFail($id);
            
            // Store values before deletion
            $accountId = $deposit->account_id;
            $amount = $deposit->amount;
            
            $deposit->delete();

            // Subtract amount from account (reverse the deposit)
            app(AccountController::class)->SubtractFromAccountBalance($accountId, new Request([
                'amount' => $amount
            ]));

            DB::commit();
            
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Get all deleted deposits
    public function indexDeleted(Request $request)
    {
        $query = AccountDeposit::with('account')->onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted deposit
    public function undelete($id)
    {
        $deposit = AccountDeposit::onlyTrashed()->findOrFail($id);
        $deposit->restore();

        return response()->json($deposit->load('account'));
    }

    // Permanently delete a soft-deleted deposit
    public function forceDelete($id)
    {
        $deposit = AccountDeposit::onlyTrashed()->findOrFail($id);
        $deposit->forceDelete();

        return response()->json(null, 204);
    }
}
