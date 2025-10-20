<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Http\Requests\InvoiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    // List all invoices with pagination and filtering
    public function index(Request $request)
    {
        $query = Invoice::with(['client', 'account', 'car.carModel.make']);
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Store a new invoice
    public function store(InvoiceRequest $request)
    {
        $invoice = Invoice::create([
            'client_id' => $request->client_id,
            'account_id' => $request->account_id,
            'amount' => $request->amount,
            'invoice_date' => $request->invoice_date,
            'car_id' => $request->car_id,
            'payed' => $request->payed,
            'account_cut' => $request->account_cut,
        ]);

        if ($request->account_id){
            app(AccountController::class)->AddAccountCut($request->account_id, new Request([
                'amount' => $request->account_cut
            ]));
        }

        if ($request->payed < $request->amount){
            app(ClientController::class)->SubtractFromClientBalance($request->client_id, new Request([
                'amount' => $request->amount - $request->payed
            ]));
        }

        // Load relationships for the response
        return response()->json($invoice->load(['client', 'account', 'car.carModel.make']), 201);
    }

    // Show a single invoice
    public function show($id)
    {
        $invoice = Invoice::with(['client', 'account', 'car.carModel.make'])->findOrFail($id);
        return response()->json($invoice);
    }

    // Update an invoice
    public function update(InvoiceRequest $request, $id)
    {
        // Begin transaction to ensure data consistency
        DB::beginTransaction();
        
        try {
            $invoice = Invoice::lockForUpdate()->findOrFail($id);
            $oldAmount = $invoice->amount;
            $oldPayed = $invoice->payed;
            $oldAccountId = $invoice->account_id;
            $oldAccountCut = $invoice->account_cut;
        
            // Handle account changes and account cut updates
            if ($oldAccountId) {
                if ($request->account_id != $oldAccountId) {
                    // Account changed - remove old cut and add new cut
                    app(AccountController::class)->SubtractFromAccountCut($oldAccountId, new Request([
                        'amount' => $oldAccountCut
                    ]));
                    
                    if ($request->account_id) {
                        app(AccountController::class)->AddAccountCut($request->account_id, new Request([
                            'amount' => $request->account_cut
                        ]));
                    }
                } elseif ($request->account_cut != $oldAccountCut) {
                    // Same account but different cut
                    app(AccountController::class)->AddAccountCut($oldAccountId, new Request([
                        'amount' => $request->account_cut - $oldAccountCut
                    ]));
                }
            } elseif ($request->account_id) {
                // New account added
                app(AccountController::class)->AddAccountCut($request->account_id, new Request([
                    'amount' => $request->account_cut
                ]));
            }
        
            // Handle changes in amount or payment that affect client balance
            if ($oldAmount != $request->amount || $oldPayed != $request->payed) {
                $oldBalance = $oldAmount - $oldPayed;
                $newBalance = $request->amount - $request->payed;
                
                if ($oldBalance < $newBalance) {
                    // Client owes more
                    app(ClientController::class)->SubtractFromClientBalance($invoice->client_id, new Request([
                        'amount' => $newBalance - $oldBalance
                    ]));
                } elseif ($oldBalance > $newBalance) {
                    // Client owes less
                    app(ClientController::class)->AddToClient($invoice->client_id, new Request([
                        'amount' => $oldBalance - $newBalance
                    ]));
                }
            }
        
            // Update the invoice
            $invoice->update([
                'client_id' => $request->client_id,
                'account_id' => $request->account_id,
                'amount' => $request->amount,
                'invoice_date' => $request->invoice_date,
                'car_id' => $request->car_id,
                'payed' => $request->payed,
                'account_cut' => $request->account_cut,
            ]);
        
            DB::commit();
        
            // Load relationships for the response
            return response()->json($invoice->load(['client', 'account', 'car.carModel.make']));
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update invoice: ' . $e->getMessage()], 500);
        }
    }

    // Delete an invoice
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();

        if ($invoice->account_id){
            app(AccountController::class)->SubtractFromAccountCut($invoice->account_id, new Request([
                'amount' => $invoice->account_cut
            ]));
        }
        if ($invoice->payed < $invoice->amount){
            app(ClientController::class)->AddToClient($invoice->client_id, new Request([
                'amount' => $invoice->amount - $invoice->payed
            ]));
        }

        return response()->json(null, 204);
    }

    // Get all deleted invoices
    public function indexDeleted(Request $request)
    {
        $query = Invoice::with(['client', 'account', 'car.carModel.make'])->onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted invoice
    public function undelete($id)
    {
        $invoice = Invoice::onlyTrashed()->findOrFail($id);
        $invoice->restore();

        return response()->json($invoice->load(['client', 'account', 'car.carModel.make']));
    }

    public function markAsPaid($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->payed = true;
        $invoice->save();

        return response()->json($invoice->load(['client', 'account', 'car.carModel.make']));
    }
    public function getAllAccountCut($id)
    {
        $invoices = Invoice::where('account_id', $id)->where('payed', true)->get();
        $totalCut = $invoices->sum('account_cut');

        return response()->json(['total_account_cut' => $totalCut]);
    }
    public function getAllUnpaidInvoices($id)
    {
        $invoices = Invoice::where('client_id', $id)
        ->whereColumn('payed', '<', 'amount')
        ->get();
        return response()->json($invoices);
    }
    
    public function setAccount($id , Request $request)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->account_id = $request->account_id;
        $invoice->save();

        return response()->json($invoice->load(['client', 'account', 'car.carModel.make']));
    }

    public function setAccountCutValue($id, Request $request)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->account_cut = $request->account_cut;
        $invoice->save();

        return response()->json($invoice->load(['client', 'account', 'car.carModel.make']));
    }
    public function AddPaymentToInvoice($id, Request $request)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->payed += $request->amount;
        $invoice->save();

        return response()->json($invoice->load(['client', 'account', 'car.carModel.make']));
    }
    public function RemovePaymentFromInvoice($id, Request $request)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->payed -= $request->amount;
        if ($invoice->payed < 0) {
            $invoice->payed = 0;
        }
        $invoice->save();

        return response()->json($invoice->load(['client', 'account', 'car.carModel.make']));
    }
    public function updatePayment($id, Request $request)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->payed -= $request->old_amount;
        $invoice->payed += $request->new_amount;
        if ($invoice->payed < 0) {
            $invoice->payed = 0;
        }
        $invoice->save();

        return response()->json($invoice->load(['client', 'account', 'car.carModel.make']));
    }
}
