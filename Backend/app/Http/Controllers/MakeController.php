<?php

namespace App\Http\Controllers;

use App\Models\Make;
use App\Http\Requests\MakeRequest;
use Illuminate\Http\Request;

class MakeController extends Controller
{
    // List all makes with pagination and filtering
    public function index(Request $request)
    {
        $query = Make::query();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Store a new make
    public function store(MakeRequest $request)
    {
        $make = Make::create([
            'name' => $request->name,
        ]);

        return response()->json($make, 201);
    }

    // Show a single make
    public function show($id)
    {
        $make = Make::findOrFail($id);
        return response()->json($make);
    }

    // Update a make
    public function update(MakeRequest $request, $id)
    {
        $make = Make::findOrFail($id);
        $make->name = $request->name;
        $make->save();

        return response()->json($make);
    }

    // Delete a make
    public function destroy($id)
    {
        $make = Make::with('carModels')->findOrFail($id);
        
        // Check if make has any linked car models
        if ($make->carModels()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete make',
                'message' => 'This make is linked to one or more car models. Please remove or reassign the car models before deleting the make.'
            ], 422);
        }
        
        $make->delete();

        return response()->json(null, 204);
    }

    // Get all deleted makes
    public function indexDeleted(Request $request)
    {
        $query = Make::onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted make
    public function undelete($id)
    {
        $make = Make::onlyTrashed()->findOrFail($id);
        $make->restore();

        return response()->json($make);
    }
}