import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Header from '../components/Header.jsx'
export default function MainLayout({ children }) {
  const [open, setOpen] = useState(false)
  return (<div className="layout"><Sidebar open={open} onClose={() => setOpen(false)} />
    <div className="main"><Header onMenu={() => setOpen(!open)} /><main className="content">{children}</main></div></div>)
}
