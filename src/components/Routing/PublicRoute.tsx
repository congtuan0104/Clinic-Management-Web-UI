import { PATHS } from "@/config";
import { AuthModule } from "@/enums";
import { useAppSelector } from "@/hooks";
import { userInfoSelector } from "@/store";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const userInfo = useAppSelector(userInfoSelector);

  switch (userInfo?.moduleId) {
    case AuthModule.Admin:
      return <Navigate to={PATHS.ADMIN_DASHBOARD} replace />
    case AuthModule.Clinic:
      return <Navigate to={PATHS.CLINIC_DASHBOARD} replace />
    // case AuthModule.Patient:
    //   return <Navigate to={PATHS.PATIENT_DASHBOARD} replace />
    default:
      return <>{children}</>
  }
};

export default PublicRoute;