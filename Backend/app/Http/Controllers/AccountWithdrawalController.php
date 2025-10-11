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
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
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

        $withdrawal->update([
            'account_id' => $request->account_id,
            'amount' => $request->amount,
            'withdrawal_date' => $request->withdrawal_date,
        ]);



        // Load the account relationship for the response
        return response()->json($withdrawal->load('account'));
    }

    // Delete an account withdrawal
    public function destroy($id)
    {
        $withdrawal = AccountWithdrawal::findOrFail($id);
        $withdrawal->delete();

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
}
