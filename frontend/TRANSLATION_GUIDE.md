# Arabic Language Support - Translation Guide

## ✅ Completed Setup

All infrastructure is ready:
- ✅ i18next configuration with RTL support
- ✅ English & Arabic translation files (200+ keys)
- ✅ Currency formatters (LYD with Western digits)
- ✅ RTL CSS styles
- ✅ Language switcher in sidebar
- ✅ Login page fully translated
- ✅ Sidebar fully translated

## 🔄 How to Translate Components

### Step-by-Step Translation Process

For each component that needs translation, follow this pattern:

#### 1. Import the translation hook
```typescript
import { useTranslation } from 'react-i18next';
```

#### 2. Use the hook in your component
```typescript
export function MyComponent() {
  const { t } = useTranslation();
  // ... rest of component
}
```

#### 3. Replace hardcoded strings with translation keys
```typescript
// Before:
<h1>User Management</h1>

// After:
<h1>{t('user.management')}</h1>
```

#### 4. Use formatters for currency, numbers, and dates
```typescript
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';

// Currency (LYD with Western digits)
<span>{formatCurrency(1234.56)}</span>
// Displays: "1,234.56 LYD" in English, "1,234.56 د.ل" in Arabic

// Date
<span>{formatDate('2024-01-15')}</span>
// Displays with locale-specific format but Western digits

// Number
<span>{formatNumber(1234567)}</span>
// Displays: "1,234,567" (Western digits in both languages)
```

### Common Translation Patterns

#### Page Headers
```typescript
<div className="mb-6">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
    {t('car.management')}
  </h1>
  <p className="text-gray-600 dark:text-gray-400">
    {t('car.manageDescription')}
  </p>
</div>
```

#### Buttons
```typescript
<Button onClick={handleAdd}>
  <HiPlus className="mr-2 h-5 w-5" />
  {t('car.addCar')}
</Button>
```

#### Form Labels
```typescript
<Label htmlFor="name">
  {t('common.name')} <span className="text-red-500">*</span>
</Label>
```

#### Placeholders
```typescript
<TextInput
  placeholder={t('car.searchPlaceholder')}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

#### Table Headers
```typescript
<thead>
  <tr>
    <th>{t('common.id')}</th>
    <th>{t('car.make')}</th>
    <th>{t('car.model')}</th>
    <th>{t('common.actions')}</th>
  </tr>
</thead>
```

#### Validation Messages
```typescript
const validate = () => {
  const errors: Record<string, string> = {};
  
  if (!formData.name.trim()) {
    errors.name = t('validation.nameRequired');
  }
  
  if (!formData.email.trim()) {
    errors.email = t('validation.emailRequired');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = t('validation.invalidEmail');
  }
  
  return errors;
};
```

#### Confirmation Dialogs
```typescript
const handleDelete = async (id: number) => {
  if (!window.confirm(t('car.deleteConfirm'))) {
    return;
  }
  // ... delete logic
};
```

#### Loading States
```typescript
{loading ? (
  <span>{t('common.loading')}...</span>
) : (
  <span>{t('common.save')}</span>
)}
```

#### Empty States
```typescript
{items.length === 0 ? (
  <p>{searchTerm ? t('car.noCarsFound') : t('car.noCars')}</p>
) : (
  // ... render items
)}
```

## 📋 Translation Keys Reference

All translation keys are in `/src/locales/en.json` and `/src/locales/ar.json`.

### Categories

#### common.*
General UI elements: loading, save, cancel, delete, edit, add, update, search, etc.

#### auth.*
Authentication: login, logout, password, email, signin, etc.

#### sidebar.*
Navigation menu items

#### user.*
User management: addUser, createUser, updateUser, roles, etc.

#### settings.*
Settings modal: accountInfo, changePassword, logout, etc.

#### car.*
Car management: addCar, updateCar, make, model, vin, licensePlate, etc.

#### carModel.*
Car model management

#### make.*
Car make management

#### invoice.*
Invoice management: invoiceNumber, totalAmount, paidAmount, etc.

#### payment.*
Payment management: paymentDate, paymentMethod, paymentAmount, etc.

#### client.*
Client management: clientName, phone, address, city, etc.

#### account.*
Employee account management

#### accountWithdrawal.*
Account withdrawal management

#### expense.*
General expense management

#### carExpense.*
Car expense management

#### validation.*
Form validation messages

#### messages.*
Success/error messages

#### financial.*
Currency and financial terms

## 🎯 Components to Translate

### Priority 1: Core Components (Do These First)
- [ ] `/src/components/SettingsModal.tsx`
- [ ] `/src/Pages/userPages/UserList.tsx`
- [ ] `/src/Pages/userPages/UserForm.tsx`
- [ ] `/src/Pages/userPages/UserUpdate.tsx`

### Priority 2: Client & Account Components
- [ ] `/src/Pages/clientPages/ClientList.tsx`
- [ ] `/src/Pages/clientPages/ClientForm.tsx`
- [ ] `/src/Pages/clientPages/ClientUpdate.tsx`
- [ ] `/src/Pages/clientPages/AccountInfoModal.tsx`
- [ ] `/src/Pages/accountPages/AccountList.tsx`
- [ ] `/src/Pages/accountPages/AccountForm.tsx`
- [ ] `/src/Pages/accountPages/AccountUpdate.tsx`
- [ ] `/src/Pages/accountPages/AccountInfoModal.tsx`

### Priority 3: Car Components
- [ ] `/src/Pages/carPages/CarList.tsx`
- [ ] `/src/Pages/carPages/CarForm.tsx`
- [ ] `/src/Pages/carPages/CarUpdate.tsx`
- [ ] `/src/Pages/carPages/CarInfoModal.tsx`
- [ ] `/src/Pages/carModelPages/CarModelList.tsx`
- [ ] `/src/Pages/carModelPages/CarModelForm.tsx`
- [ ] `/src/Pages/carModelPages/CarModelUpdate.tsx`
- [ ] `/src/Pages/makePages/MakeList.tsx`
- [ ] `/src/Pages/makePages/MakeForm.tsx`
- [ ] `/src/Pages/makePages/MakeUpdate.tsx`

### Priority 4: Financial Components
- [ ] `/src/Pages/invoicePages/InvoiceList.tsx`
- [ ] `/src/Pages/invoicePages/InvoiceForm.tsx`
- [ ] `/src/Pages/invoicePages/InvoiceUpdate.tsx`
- [ ] `/src/Pages/invoicePages/InvoiceInfoModal.tsx`
- [ ] `/src/Pages/paymentPages/PaymentList.tsx`
- [ ] `/src/Pages/paymentPages/PaymentForm.tsx`
- [ ] `/src/Pages/paymentPages/PaymentUpdate.tsx`
- [ ] `/src/Pages/paymentPages/PaymentInfoModal.tsx`

### Priority 5: Expense Components
- [ ] `/src/Pages/accountWithdrawalPages/AccountWithdrawalList.tsx`
- [ ] `/src/Pages/accountWithdrawalPages/AccountWithdrawalForm.tsx`
- [ ] `/src/Pages/accountWithdrawalPages/AccountWithdrawalUpdate.tsx`
- [ ] `/src/Pages/accountWithdrawalPages/AccountWithdrawalInfoModal.tsx`
- [ ] `/src/Pages/carExpensePages/CarExpenseList.tsx`
- [ ] `/src/Pages/carExpensePages/CarExpenseForm.tsx`
- [ ] `/src/Pages/carExpensePages/CarExpenseUpdate.tsx`
- [ ] `/src/Pages/carExpensePages/CarExpenseInfoModal.tsx`
- [ ] `/src/Pages/expensePages/ExpenseList.tsx`
- [ ] `/src/Pages/expensePages/ExpenseForm.tsx`
- [ ] `/src/Pages/expensePages/ExpenseUpdate.tsx`
- [ ] `/src/Pages/expensePages/ExpenseInfoModal.tsx`

## 🔍 Example: Complete Component Translation

Here's a complete example showing a translated component:

```typescript
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Badge, TextInput } from "flowbite-react";
import { HiPlus, HiPencil, HiTrash, HiSearch } from "react-icons/hi";
import { carServices } from "../../services/carServices";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { CarForm } from "./CarForm";
import { CarUpdate } from "./CarUpdate";
import type { Car } from "../../models/Car";

export function CarList() {
  const { t } = useTranslation();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await carServices.getAllCars();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('car.deleteConfirm'))) {
      return;
    }

    try {
      await carServices.deleteCar(id);
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      alert(t('messages.deleteFailed'));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t('car.management')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('car.manageDescription')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <TextInput
            icon={HiSearch}
            placeholder={t('car.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <HiPlus className="mr-2 h-5 w-5" />
          {t('car.addCar')}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="ml-3 text-gray-500">{t('common.loading')}...</span>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>{t('common.id')}</th>
              <th>{t('car.make')}</th>
              <th>{t('car.model')}</th>
              <th>{t('car.year')}</th>
              <th>{t('car.vin')}</th>
              <th>{t('car.purchasePrice')}</th>
              <th>{t('car.carStatus')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  {searchTerm ? t('car.noCarsFound') : t('car.noCars')}
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car.id}>
                  <td>#{car.id}</td>
                  <td>{car.make}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>{car.vin}</td>
                  <td>{formatCurrency(car.purchase_price)}</td>
                  <td>
                    <Badge color={car.status === 'sold' ? 'success' : 'info'}>
                      {t(`car.${car.status}`)}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(car)}>
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" color="failure" onClick={() => handleDelete(car.id)}>
                        <HiTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

## 🧪 Testing Checklist

After translating each component:

1. **Start the app**: `npm run dev`
2. **Test in English**:
   - All text appears in English
   - UI is left-to-right
   - Currency shows "LYD" prefix
   - Numbers use Western digits (123)

3. **Switch to Arabic** (click globe icon in sidebar):
   - All text appears in Arabic
   - UI switches to right-to-left
   - Sidebar moves to right side
   - Currency shows "د.ل" suffix
   - Numbers still use Western digits (123)

4. **Test functionality**:
   - Forms submit correctly
   - Validation messages appear in current language
   - Modals open/close properly
   - Data loads and displays

## 🚀 Quick Start for Next Component

1. Open the component file
2. Add import: `import { useTranslation } from 'react-i18next';`
3. Add hook: `const { t } = useTranslation();`
4. Find all hardcoded strings
5. Replace with `{t('category.key')}`
6. Add formatter imports if needed
7. Use `formatCurrency()`, `formatDate()`, etc. for data
8. Test in both languages

## 💡 Tips

- Use VS Code search (`Ctrl+F`) to find hardcoded strings like `"Add"`, `"Delete"`, etc.
- Check translation files for exact key names
- Keep translation keys consistent across similar components
- Test RTL layout after each component
- Currency amounts always use Western digits (as requested)

## ⚠️ Important Notes

1. **Always use Western digits** - Don't convert numbers to Arabic-Indic numerals
2. **Currency format**: 
   - English: "1,234.56 LYD"
   - Arabic: "1,234.56 د.ل"
3. **RTL applies to layout**, not to numbers or currency symbols
4. **Test both languages** before considering a component done

## 📞 Need Help?

If you encounter issues:
1. Check `/src/locales/en.json` and `/src/locales/ar.json` for available keys
2. Review the Login component (`/src/Pages/authPages/Login.tsx`) for a complete example
3. Ensure `formatters.ts` is imported for currency/date/number formatting
4. Check browser console for missing translation warnings

---

**Status**: Infrastructure complete, Login & Sidebar translated  
**Next**: Translate Settings Modal and User components as shown in Priority 1
