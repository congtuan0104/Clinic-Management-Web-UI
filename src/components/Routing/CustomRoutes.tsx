import { useEffect, useState } from "react"
import { Routes, useLocation } from "react-router"
import TopBarProgress from "react-topbar-progress-indicator"

TopBarProgress.config({
  barColors: {
    "0": "#6964ff",
    "1.0": "#63e6be"
  },
  barThickness: 6
});

const CustomRoutes = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState(false)
  const [prevLoc, setPrevLoc] = useState("")
  const location = useLocation()

  useEffect(() => {
    setPrevLoc(location.pathname)
    setProgress(true)
    if (location.pathname === prevLoc) {
      setPrevLoc('')
    }
  }, [location])

  useEffect(() => {
    setProgress(false)
  }, [prevLoc])

  return (
    <>
      {progress && <TopBarProgress />}
      <Routes>{children}</Routes>
    </>
  )
}

export default CustomRoutes