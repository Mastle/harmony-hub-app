"use client"

import Navbar from "./Navbar"
import { Outlet } from "react-router"

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
export default MainLayout
