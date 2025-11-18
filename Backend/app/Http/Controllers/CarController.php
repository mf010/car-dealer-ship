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
            'name' => $request->name,
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
            'name' => $request->name,
            'car_model_id' => $request->car_model_id,
            'status' => $request->status ?? $car->status,
            'purchase_price' => $request->purchase_price,
        ]);

        return response()->json($car->load(['carModel.make']));
    }

    // Delete a car
    public function destroy($id)
    {
        $car = Car::with(['invoices', 'expenses'])->findOrFail($id);
        
        // Check if car has any linked invoices
        if ($car->invoices()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete car',
                'message' => 'This car is linked to one or more invoices. Please remove or reassign the invoices before deleting the car.'
            ], 422);
        }
        
        // Check if car has any linked car expenses
        if ($car->expenses()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete car',
                'message' => 'This car is linked to one or more car expenses. Please remove the car expenses before deleting the car.'
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

    /**
     * Report: Cars created before a starting date and not sold before that date
     * 
     * @param Request $request - expects 'starting_date' parameter (format: Y-m-d)
     * @return \Illuminate\Http\JsonResponse
     */
    public function reportCarsNotSoldBeforeStartDate(Request $request)
    {
        // Validate the starting_date parameter
        $request->validate([
            'starting_date' => 'required|date|date_format:Y-m-d',
        ]);

        $startingDate = $request->starting_date;

        // Get cars created before the starting date
        $cars = Car::with(['carModel.make', 'invoices'])
            ->where('created_at', '<', $startingDate)
            ->whereDoesntHave('invoices', function ($query) use ($startingDate) {
                // Exclude cars that have invoices before the starting date
                $query->where('invoice_date', '<', $startingDate);
            })
            ->get();

        // Format the response with detailed information
        $report = $cars->map(function ($car) use ($startingDate) {
            // Check if car was sold after the starting date
            $soldAfterDate = $car->invoices()
                ->where('invoice_date', '>=', $startingDate)
                ->first();

            return [
                'id' => $car->id,
                'make' => $car->carModel->make->name ?? null,
                'model' => $car->carModel->name ?? null,
                'status' => $car->status,
                'purchase_price' => $car->purchase_price,
                'total_expenses' => $car->total_expenses,
                'created_at' => $car->created_at,
                'sold_after_starting_date' => $soldAfterDate ? true : false,
                'sold_date' => $soldAfterDate ? $soldAfterDate->invoice_date : null,
            ];
        });

        return response()->json([
            'starting_date' => $startingDate,
            'total_cars' => $report->count(),
            'cars' => $report,
        ]);
    }

    /**
     * Report: Cars sold within a date range (after starting date and before ending date)
     * 
     * @param Request $request - expects 'starting_date' and 'ending_date' parameters (format: Y-m-d)
     * @return \Illuminate\Http\JsonResponse
     */
    public function reportCarsSoldBetweenDates(Request $request)
    {
        // Validate the date parameters
        $request->validate([
            'starting_date' => 'required|date|date_format:Y-m-d',
            'ending_date' => 'required|date|date_format:Y-m-d|after_or_equal:starting_date',
        ]);

        $startingDate = $request->starting_date;
        $endingDate = $request->ending_date;

        // Get cars that have invoices (sold) between the date range
        // The car's created_at can be any time before the ending date
        $cars = Car::with(['carModel.make', 'invoices'])
            ->where('created_at', '<', $endingDate)
            ->whereHas('invoices', function ($query) use ($startingDate, $endingDate) {
                // Car must have at least one invoice between the date range
                $query->where('invoice_date', '>', $startingDate)
                      ->where('invoice_date', '<', $endingDate);
            })
            ->get();

        // Format the response with detailed information
        $report = $cars->map(function ($car) use ($startingDate, $endingDate) {
            // Get the invoice(s) within the date range
            $invoicesInRange = $car->invoices()
                ->where('invoice_date', '>', $startingDate)
                ->where('invoice_date', '<', $endingDate)
                ->get();

            // Get the first invoice in the range (earliest sold date)
            $firstInvoice = $invoicesInRange->sortBy('invoice_date')->first();

            return [
                'id' => $car->id,
                'make' => $car->carModel->make->name ?? null,
                'model' => $car->carModel->name ?? null,
                'status' => $car->status,
                'purchase_price' => $car->purchase_price,
                'total_expenses' => $car->total_expenses,
                'created_at' => $car->created_at,
                'sold_date' => $firstInvoice->invoice_date,
                'invoice_id' => $firstInvoice->id,
                'invoice_amount' => $firstInvoice->amount,
                'client_id' => $firstInvoice->client_id,
                'total_invoices_in_range' => $invoicesInRange->count(),
            ];
        });

        return response()->json([
            'starting_date' => $startingDate,
            'ending_date' => $endingDate,
            'total_cars' => $report->count(),
            'cars' => $report,
        ]);
    }

    
}
