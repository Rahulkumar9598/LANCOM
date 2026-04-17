import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
 import { ToastContainer } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Outlet />
      <ToastContainer/>
    </>
  )
}

export default App
