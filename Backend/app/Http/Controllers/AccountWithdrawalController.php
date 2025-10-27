<?php

namespace App\Http\Controllers;

use App\Models\AccountWithdrawal;
use App\Http\Requests\AccountWithdrawalRequest;
use Illuminate\Http\Request;

class AccountWithdrawalController extends Controller
{
    // List all account withdrawals with pagination and filtering
    public function index(Request $request)
    {
        $query = AccountWithdrawal::with('account');
        
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

    // Store a new account withdrawal
    public function store(AccountWithdrawalRequest $request)
    {
        $withdrawal = AccountWithdrawal::create([
            'account_id' => $request->account_id,
            'amount' => $request->amount,
            'withdrawal_date' => $request->withdrawal_date,
        ]);

        app(AccountController::class)->SubtractFromAccountBalance($request->account_id, new Request([
            'amount' => $request->amount
        ]));

        // Load the account relationship for the response
        return response()->json($withdrawal->load('account'), 201);
    }

    // Show a single account withdrawal
    public function show($id)
    {
        $withdrawal = AccountWithdrawal::with('account')->findOrFail($id);
        return response()->json($withdrawal);
    }

    // Update an account withdrawal
    public function update(AccountWithdrawalRequest $request, $id)
    {
        $withdrawal = AccountWithdrawal::findOrFail($id);
        
        $oldAmount = $withdrawal->amount;
        $oldAccountId = $withdrawal->account_id;

        $withdrawal->update([
            'account_id' => $request->account_id,
            'amount' => $request->amount,
            'withdrawal_date' => $request->withdrawal_date,
        ]);

        // Handle account balance changes
        if ($oldAccountId == $request->account_id) {
            // Same account, just adjust the difference
            $difference = $request->amount - $oldAmount;
            if ($difference > 0) {
                // New amount is higher, subtract more from account
                app(AccountController::class)->SubtractFromAccountBalance($request->account_id, new Request([
                    'amount' => $difference
                ]));
            } elseif ($difference < 0) {
                // New amount is lower, add back to account
                app(AccountController::class)->AddToAccountBalance($request->account_id, new Request([
                    'amount' => abs($difference)
                ]));
            }
        } else {
            // Different account - add old amount back to old account and subtract new amount from new account
            app(AccountController::class)->AddToAccountBalance($oldAccountId, new Request([
                'amount' => $oldAmount
            ]));
            app(AccountController::class)->SubtractFromAccountBalance($request->account_id, new Request([
                'amount' => $request->amount
            ]));
        }

        // Load the account relationship for the response
        return response()->json($withdrawal->load('account'));
    }

    // Delete an account withdrawal
    public function destroy($id)
    {
        $withdrawal = AccountWithdrawal::findOrFail($id);
        
        // Store values before deletion
        $accountId = $withdrawal->account_id;
        $amount = $withdrawal->amount;
        
        $withdrawal->delete();

        // Add amount back to account
        app(AccountController::class)->AddToAccountBalance($accountId, new Request([
            'amount' => $amount
        ]));

        return response()->json(null, 204);
    }

    // Get all deleted withdrawals
    public function indexDeleted(Request $request)
    {
        $query = AccountWithdrawal::with('account')->onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted withdrawal
    public function undelete($id)
    {
        $withdrawal = AccountWithdrawal::onlyTrashed()->findOrFail($id);
        $withdrawal->restore();

        return response()->json($withdrawal->load('account'));
    }

    // Permanently delete a soft-deleted withdrawal
    public function forceDelete($id)
    {
        $withdrawal = AccountWithdrawal::onlyTrashed()->findOrFail($id);
        $withdrawal->forceDelete();

        return response()->json(null, 204);
    }
}
