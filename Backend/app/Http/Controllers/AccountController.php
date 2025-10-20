<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Http\Requests\AccountRequest;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    // List all accounts with pagination and filtering
    public function index(Request $request)
    {
        $query = Account::query();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Store a new account
    public function store(AccountRequest $request)
    {
        $account = Account::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'balance' => $request->balance ?? 0,
        ]);

        return response()->json($account, 201);
    }

    // Show a single account
    public function show($id)
    {
        $account = Account::findOrFail($id);
        return response()->json($account);
    }

    // Update an account
    public function update(AccountRequest $request, $id)
    {
        $account = Account::findOrFail($id);
        $account->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'balance' => $request->balance ?? $account->balance,
        ]);

        return response()->json($account);
    }

    // Delete an account
    public function destroy($id)
    {
        $account = Account::findOrFail($id);
        $account->delete();

        return response()->json(null, 204);
    }

    // Get all deleted accounts
    public function indexDeleted(Request $request)
    {
        $query = Account::onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted account
    public function undelete($id)
    {
        $account = Account::onlyTrashed()->findOrFail($id);
        $account->restore();

        return response()->json($account);
    }
    public function AddToAccount($id, Request $request)
    {
        $account = Account::findOrFail($id);
        $account->balance += $request->amount;
        $account->save();

        return response()->json($account);
    }
    public function SubtractFromAccountCut($id, Request $request)
    {
        $account = Account::findOrFail($id);
        $account->balance -= $request->amount;
        $account->save();

        return response()->json($account);
    }

    public function AddAccountCut($id, Request $request)
    {
        $account = Account::findOrFail($id);
        $account->balance += $request->amount;
        $account->save();

        return response()->json($account);
    }

}
