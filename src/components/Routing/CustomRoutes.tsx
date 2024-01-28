import { useNetwork } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react"
import { Routes, useLocation } from "react-router"
import TopBarProgress from "react-topbar-progress-indicator"
import { CiWifiOff, CiWifiOn } from "react-icons/ci";

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
  // const networkStatus = useNetwork();

  useEffect(() => {
    setPrevLoc(location.pathname)
    setProgress(true)
    if (location.pathname === prevLoc) {
      setPrevLoc('')
    }
  }, [location])

  // useEffect(() => {
  //   console.log(networkStatus)
  //   if (networkStatus.online) {
  //     notifications.show({
  //       title: "Thông báo",
  //       message: "Đã có kết nối trở lại",
  //       color: "teal",
  //       icon: <CiWifiOn />,
  //     })
  //   }
  //   else {
  //     notifications.show({
  //       title: "Thông báo",
  //       message: "Bạn đang ngoại tuyến",
  //       color: "red.5",
  //       icon: <CiWifiOff />,
  //     })
  //   }
  // }, [networkStatus.online])

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