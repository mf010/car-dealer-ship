import { Routes , Route, Navigate } from 'react-router-dom'
import './App.css'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Dashboard } from './components/Dashboard'
import { MakeList } from './Pages/makePages/MakeList'
import { CarModelList } from './Pages/carModelPages/CarModelList'
import { ClientList } from './Pages/clientPages/ClientList'
import { AccountList } from './Pages/accountPages/AccountList'
import { CarList } from './Pages/carPages/CarList'
import { InvoiceList } from './Pages/invoicePages/InvoiceList'
import { PaymentList } from './Pages/paymentPages/PaymentList'
import { AccountWithdrawalList } from './Pages/accountWithdrawalPages/AccountWithdrawalList'
import { CarExpenseList } from './Pages/carExpensePages/CarExpenseList'
import { ExpenseList } from './Pages/expensePages/ExpenseList'
import { UserList } from './Pages/userPages/UserList'
import { Login } from './Pages/authPages/Login'
import { authServices } from './services/authServices'

function App() {

  return (
    <>
      <Routes>
        {/* Default route - redirect to dashboard if authenticated, otherwise to login */}
        <Route 
          path="/rakan-bayan/" 
          element={
            authServices.isAuthenticated() 
              ? <Navigate to="/rakan-bayan/dashboard" replace /> 
              : <Navigate to="/rakan-bayan/login" replace />
          } 
        />
        
        {/* Public Routes */}
        <Route path="/rakan-bayan/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/rakan-bayan/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/rakan-bayan/dashboard" element={<Dashboard />} />
          <Route path="/rakan-bayan/cars" element={<CarList />}/>
          <Route path="/rakan-bayan/invoices" element={<InvoiceList />} />
          <Route path="/rakan-bayan/payments" element={<PaymentList />} />
          <Route path="/rakan-bayan/account-withdrawals" element={<AccountWithdrawalList />} />
          <Route path="/rakan-bayan/car-expenses" element={<CarExpenseList />} />
          <Route path="/rakan-bayan/employees" element={<AccountList />} />
          <Route path="/rakan-bayan/accounts" element={<AccountList />} />
          <Route path="/rakan-bayan/clients" element={<ClientList />} />
          <Route path="/rakan-bayan/users" element={<UserList />} />
          <Route path="/rakan-bayan/expenses" element={<ExpenseList />} />
          <Route path="/rakan-bayan/make" element={<MakeList />} />
          <Route path="/rakan-bayan/car-models" element={<CarModelList />} />
          <Route path="/rakan-bayan/about" element={<div>About</div>} />
        </Route>
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/rakan-bayan/login" replace />} />
      </Routes>
    </>
  )
}

export default App
