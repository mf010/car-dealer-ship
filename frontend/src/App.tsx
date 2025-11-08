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
          path="/" 
          element={
            authServices.isAuthenticated() 
              ? <Navigate to="/dashboard" replace /> 
              : <Navigate to="/login" replace />
          } 
        />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cars" element={<CarList />}/>
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="payments" element={<PaymentList />} />
          <Route path="account-withdrawals" element={<AccountWithdrawalList />} />
          <Route path="car-expenses" element={<CarExpenseList />} />
          <Route path="employees" element={<AccountList />} />
          <Route path="accounts" element={<AccountList />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="users" element={<UserList />} />
          <Route path="expenses" element={<ExpenseList />} />
          <Route path="make" element={<MakeList />} />
          <Route path="car-models" element={<CarModelList />} />
          <Route path="about" element={<div>About</div>} />
        </Route>
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
