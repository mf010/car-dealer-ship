<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Http\Requests\ClientRequest;

class ClientController extends Controller
{
    // List all clients with pagination and filtering
    public function index(Request $request)
    {
        $query = Client::query();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Store a new client
    public function store(ClientRequest $request)
    {
        $client = Client::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'personal_id' => $request->personal_id,
            'address' => $request->address,
            'balance' => $request->balance ?? 0,
        ]);

        return response()->json($client, 201);
    }

    // Show a single client
    public function show($id)
    {
        $client = Client::findOrFail($id);
        return response()->json($client);
    }

    // Update a client
    public function update(ClientRequest $request, $id)
    {
        $client = Client::findOrFail($id);
        $client->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'personal_id' => $request->personal_id,
            'address' => $request->address,
            'balance' => $request->balance ?? $client->balance,
        ]);

        return response()->json($client);
    }

    // Delete a client
    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json(null, 204);
    }

    // Get all deleted clients
    public function indexDeleted(Request $request)
    {
        $query = Client::onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted client
    public function undelete($id)
    {
        $client = Client::onlyTrashed()->findOrFail($id);
        $client->restore();

        return response()->json($client);
    }

    public function AddToClient($id, Request $request)
    {
        $client = Client::findOrFail($id);
        $client->balance += $request->amount;
        $client->save();

        return response()->json($client);
    }
    public function SubtractFromClient($id, Request $request)
    {
        $client = Client::findOrFail($id);
        $client->balance -= $request->amount;
        $client->save();

        return response()->json($client);
    }
}
