import { Routes , Route } from 'react-router-dom'
import './App.css'
import { ErrorPanel } from './components/ErrorPanel'
import { Layout } from './components/Layout'
import { MakeList } from './Pages/makePages/MakeList'
import { CarModelList } from './Pages/carModelPages/CarModelList'
import { ClientList } from './Pages/clientPages/ClientList'
import { AccountList } from './Pages/accountPages/AccountList'
import { CarList } from './Pages/carPages/CarList'
import { InvoiceList } from './Pages/invoicePages/InvoiceList'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Home</div>} />
          <Route path="dashboard" element={<div>Dashboard</div>} />
          <Route path="cars" element={<CarList />}/>
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="employees" element={<AccountList />} />
          <Route path="accounts" element={<AccountList />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="expenses" element={<div>Expenses</div>} />
          <Route path="make" element={<MakeList />} />
          <Route path="car-models" element={<CarModelList />} />
          <Route path="about" element={<div>About</div>} />
          <Route path="*" element={<ErrorPanel />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
