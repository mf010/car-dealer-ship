# Script to add scrollable wrapper to all Modal components
# This adds max-h-[85vh] overflow-y-auto wrapper to make modals scrollable

$files = @(
    "frontend\src\Pages\userPages\UserUpdate.tsx",
    "frontend\src\Pages\makePages\MakeForm.tsx",
    "frontend\src\Pages\makePages\MakeUpdate.tsx",
    "frontend\src\Pages\carModelPages\CarModelForm.tsx",
    "frontend\src\Pages\carModelPages\CarModelUpdate.tsx",
    "frontend\src\Pages\clientPages\ClientForm.tsx",
    "frontend\src\Pages\clientPages\ClientUpdate.tsx",
    "frontend\src\Pages\accountPages\AccountForm.tsx",
    "frontend\src\Pages\accountPages\AccountUpdate.tsx",
    "frontend\src\Pages\paymentPages\PaymentForm.tsx",
    "frontend\src\Pages\paymentPages\PaymentUpdate.tsx",
    "frontend\src\Pages\expensePages\ExpenseForm.tsx",
    "frontend\src\Pages\expensePages\ExpenseUpdate.tsx",
    "frontend\src\Pages\carExpensePages\CarExpenseForm.tsx",
    "frontend\src\Pages\carExpensePages\CarExpenseUpdate.tsx",
    "frontend\src\Pages\accountWithdrawalPages\AccountWithdrawalForm.tsx",
    "frontend\src\Pages\accountWithdrawalPages\AccountWithdrawalUpdate.tsx",
    "frontend\src\Pages\clientPages\PaymentForm.tsx",
    "frontend\src\Pages\clientPages\PaymentUpdate.tsx",
    "frontend\src\components\SettingsModal.tsx"
)

foreach ($file in $files) {
    $fullPath = "c:\xampp\htdocs\car-dealer-ship\$file"
    if (Test-Path $fullPath) {
        Write-Host "Processing: $file"
        $content = Get-Content $fullPath -Raw
        
        # Add opening div after Modal tag
        $content = $content -replace '(<Modal[^>]*>)(\s*)<div className="p-6">', '$1$2<div className="max-h-[85vh] overflow-y-auto">$2<div className="p-6">'
        
        # Add closing div before </Modal>
        $content = $content -replace '(      </div>\s*</Modal>)', '      </div>$1'
        
        Set-Content $fullPath $content -NoNewline
        Write-Host "  ✓ Updated" -ForegroundColor Green
    } else {
        Write-Host "  ✗ File not found" -ForegroundColor Red
    }
}

Write-Host "`nDone! All modal components have been updated." -ForegroundColor Cyan
