<?php

namespace App\Http\Controllers;

use App\Models\CarExpense;
use App\Http\Requests\CarExpenseRequest;
use Illuminate\Http\Request;

class CarExpenseController extends Controller
{
    // List all car expenses with pagination and filtering
    public function index(Request $request)
    {
        $query = CarExpense::with(['car.carModel.make']);
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Store a new car expense
    public function store(CarExpenseRequest $request)
    {
        $expense = CarExpense::create([
            'car_id' => $request->car_id,
            'description' => $request->description,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
        ]);

        app(CarController::class)->AddExpenseToCar($request->car_id, new Request([
            'amount' => $request->amount
        ]));

        // Load the car relationship with its model and make for the response
        return response()->json($expense->load(['car.carModel.make']), 201);
    }

    // Show a single car expense
    public function show($id)
    {
        $expense = CarExpense::with(['car.carModel.make'])->findOrFail($id);
        return response()->json($expense);
    }

    // Update a car expense
    public function update(CarExpenseRequest $request, $id)
    {
        $expense = CarExpense::findOrFail($id);
        $expense->update([
            'car_id' => $request->car_id,
            'description' => $request->description,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
        ]);

        // Load the car relationship with its model and make for the response
        return response()->json($expense->load(['car.carModel.make']));
    }

    // Delete a car expense
    public function destroy($id)
    {
        $expense = CarExpense::findOrFail($id);
        $expense->delete();

        app(CarController::class)->RemoveExpenseFromCar($expense->car_id, new Request([
            'amount' => $expense->amount
        ]));

        return response()->json(null, 204);
    }

    // Get all deleted car expenses
    public function indexDeleted(Request $request)
    {
        $query = CarExpense::with(['car.carModel.make'])->onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted car expense
    public function undelete($id)
    {
        $expense = CarExpense::onlyTrashed()->findOrFail($id);
        $expense->restore();

        return response()->json($expense->load(['car.carModel.make']));
    }
}
