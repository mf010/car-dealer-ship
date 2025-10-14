import { Routes , Route } from 'react-router-dom'
import './App.css'
import { ErrorPanel } from './components/ErrorPanel'
import { Layout } from './components/Layout'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Home</div>} />
          <Route path="dashboard" element={<div>Dashboard</div>} />
          <Route path="cars" element={<div>Cars</div>}/>
          <Route path="employees" element={<div>Employees</div>} />
          <Route path="clients" element={<div>Clients</div>} />
          <Route path="expenses" element={<div>Expenses</div>} />
          <Route path="reports" element={<div>Reports</div>} />
          <Route path="about" element={<div>About</div>} />
          <Route path="*" element={<ErrorPanel />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
