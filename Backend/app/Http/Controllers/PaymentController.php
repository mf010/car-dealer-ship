<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Http\Requests\PaymentRequest;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // List all payments with pagination and filtering
    public function index(Request $request)
    {
        $query = Payment::with(['invoice.client', 'invoice.car']);
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Store a new payment
    public function store(PaymentRequest $request)
    {
        $payment = Payment::create([
            'invoice_id' => $request->invoice_id,
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
        ]);

        // Add the payment amount to the invoice's paid amount
        app(InvoiceController::class)->AddPaymentToInvoice($request->invoice_id, new Request([
            'amount' => $request->amount
        ]));

        // Load relationships for the response
        return response()->json($payment->load(['invoice.client', 'invoice.car']), 201);
    }

    // Show a single payment
    public function show($id)
    {
        $payment = Payment::with(['invoice.client', 'invoice.car'])->findOrFail($id);
        return response()->json($payment);
    }

    // Update a payment
    public function update(PaymentRequest $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $oldAmount = $payment->amount;
        
        $payment->update([
            'invoice_id' => $request->invoice_id,
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
        ]);

        // Update the invoice's paid amount
        app(InvoiceController::class)->updatePayment($payment->invoice_id, new Request([
            'old_amount' => $oldAmount,
            'new_amount' => $request->amount
        ]));

        // Load relationships for the response
        return response()->json($payment->load(['invoice.client', 'invoice.car']));
    }

    // Delete a payment
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $invoice_id = $payment->invoice_id;
        $amount = $payment->amount;
        
        $payment->delete();

        // Remove the payment amount from the invoice's paid amount
        app(InvoiceController::class)->RemovePaymentFromInvoice($invoice_id, new Request([
            'amount' => $amount
        ]));

        return response()->json(null, 204);
    }

    // Get all deleted payments
    public function indexDeleted(Request $request)
    {
        $query = Payment::with(['invoice.client', 'invoice.car'])->onlyTrashed();
        
        if ($request->has('filters')) {
            $query->filter($request->filters);
        }
        
        return response()->json($query->paginate(10));
    }

    // Restore a deleted payment
    public function undelete($id)
    {
        $payment = Payment::onlyTrashed()->findOrFail($id);
        $payment->restore();

        return response()->json($payment->load(['invoice.client', 'invoice.car']));
    }
}
