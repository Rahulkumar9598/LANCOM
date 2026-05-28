import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoleRedirect from './component/comman/RoleRedirect';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Outlet />
      <RoleRedirect />
      <ToastContainer/>
    </>  )
}

export default App
