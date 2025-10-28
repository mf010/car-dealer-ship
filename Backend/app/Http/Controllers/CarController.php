<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Http\Requests\CarRequest;
use Illuminate\Http\Request;

class CarController extends Controller
{
    // List all cars with pagination and filtering
    public function index(Request $request)
    {
        $query = Car::with(['carModel.make']);
        
        // Support both filters[field] and direct field parameters
        if ($request->has('filters')) {
            $query->filter($request->filters);
        } else {
            // Support direct query parameters like ?status=available
            $directFilters = $request->except(['page', 'per_page']);
            if (!empty($directFilters)) {
                $query->filter($directFilters);
            }
        }
        
        return response()->json($query->paginate(10));
    }

    // Store a new car
    public function store(CarRequest $request)
    {
        $car = Car::create([
            'car_model_id' => $request->car_model_id,
            'status' => $request->status ?? 'available',
            'purchase_price' => $request->purchase_price,
        ]);

        return response()->json($car->load(['carModel.make']), 201);
    }

    // Show a single car
    public function show($id)
    {
        $car = Car::with(['carModel.make'])->findOrFail($id);
        return response()->json($car);
    }

    // Update a car
    public function update(CarRequest $request, $id)
    {
        $car = Car::findOrFail($id);
        $car->update([
            'car_model_id' => $request->car_model_id,
            'status' => $request->status ?? $car->status,
            'purchase_price' => $request->purchase_price,
        ]);

        return response()->json($car->load(['carModel.make']));
    }

    // Delete a car
    public function destroy($id)
    {
        $car = Car::with('invoices')->findOrFail($id);
        
        // Check if car has any linked invoices
        if ($car->invoices()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete car',
                'message' => 'This car is linked to one or more invoices. Please remove or reassign the invoices before deleting the car.'
            ], 422);
        }
        
        $car->delete();

        return response()->json(null, 204);
    }

    // Get all deleted cars
    public function indexDeleted(Request $request)
    {
        $query = Car::with(['carModel.make'])->onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted car
    public function undelete($id)
    {
        $car = Car::onlyTrashed()->findOrFail($id);
        $car->restore();

        return response()->json($car->load(['carModel.make']));
    }

    public function AddExpenseToCar($id, Request $request)
    {
        $car = Car::findOrFail($id);
        $car->total_expenses += $request->amount;
        $car->save();

        return response()->json($car->load(['carModel.make']));
    }
    public function RemoveExpenseFromCar($id, Request $request)
    {
        $car = Car::findOrFail($id);
        $car->total_expenses -= $request->amount;
        if ($car->total_expenses < 0) {
            $car->total_expenses = 0; // Prevent negative expenses
        }
        $car->save();

        return response()->json($car->load(['carModel.make']));
    }

    public function setCarStatus($id, Request $request)
    {
        $car = Car::findOrFail($id);
        $car->status = $request->status;
        $car->save();

        return response()->json($car->load(['carModel.make']));
    }

    
}
