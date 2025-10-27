<?php

namespace App\Http\Controllers;

use App\Models\DealerShipExpense;
use App\Http\Requests\DealerShipExpenseRequest;
use Illuminate\Http\Request;

class DealerShipExpenseController extends Controller
{
    // List all dealership expenses with pagination and filtering
    public function index(Request $request)
    {
        $query = DealerShipExpense::query();
        
        // Support both filters[field] and direct field parameters
        if ($request->has('filters')) {
            $query->filter($request->filters);
        } else {
            // Support direct query parameters like ?expense_date=2025-09-12&amount_from=5
            $directFilters = $request->except(['page', 'per_page']);
            if (!empty($directFilters)) {
                $query->filter($directFilters);
            }
        }
        
        return response()->json($query->paginate(10));
    }

    // Store a new dealership expense
    public function store(DealerShipExpenseRequest $request)
    {
        $expense = DealerShipExpense::create([
            'description' => $request->description,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
        ]);

        return response()->json($expense, 201);
    }

    // Show a single dealership expense
    public function show($id)
    {
        $expense = DealerShipExpense::findOrFail($id);
        return response()->json($expense);
    }

    // Update a dealership expense
    public function update(DealerShipExpenseRequest $request, $id)
    {
        $expense = DealerShipExpense::findOrFail($id);
        $expense->update([
            'description' => $request->description,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
        ]);

        return response()->json($expense);
    }

    // Delete a dealership expense
    public function destroy($id)
    {
        $expense = DealerShipExpense::findOrFail($id);
        $expense->delete();

        return response()->json(null, 204);
    }

    // Get all deleted dealership expenses
    public function indexDeleted(Request $request)
    {
        $query = DealerShipExpense::onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted dealership expense
    public function undelete($id)
    {
        $expense = DealerShipExpense::onlyTrashed()->findOrFail($id);
        $expense->restore();

        return response()->json($expense);
    }
}
