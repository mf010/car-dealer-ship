<?php

namespace App\Http\Controllers;

use App\Models\CarModel;
use App\Http\Requests\CarModelRequest;
use Illuminate\Http\Request;

class CarModelController extends Controller
{
    // List all car models with pagination and filtering
    public function index(Request $request)
    {
        $query = CarModel::with('make');
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Store a new car model
    public function store(CarModelRequest $request)
    {
        $carModel = CarModel::create([
            'name' => $request->name,
            'make_id' => $request->make_id,
        ]);

        return response()->json($carModel->load('make'), 201);
    }

    // Show a single car model
    public function show($id)
    {
        $carModel = CarModel::with('make')->findOrFail($id);
        return response()->json($carModel);
    }

    // Update a car model
    public function update(CarModelRequest $request, $id)
    {
        $carModel = CarModel::findOrFail($id);
        $carModel->update([
            'name' => $request->name,
            'make_id' => $request->make_id,
        ]);

        return response()->json($carModel->load('make'));
    }

    // Delete a car model
    public function destroy($id)
    {
        $carModel = CarModel::findOrFail($id);
        $carModel->delete();

        return response()->json(null, 204);
    }

    // Get all deleted car models
    public function indexDeleted(Request $request)
    {
        $query = CarModel::with('make')->onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted car model
    public function undelete($id)
    {
        $carModel = CarModel::onlyTrashed()->findOrFail($id);
        $carModel->restore();

        return response()->json($carModel->load('make'));
    }
}
