import { PATHS } from "@/config";
import { COOKIE_KEY } from "@/constants";
import { AuthModule } from "@/enums";
import { useAppSelector } from "@/hooks";
import { userInfoSelector } from "@/store";
import { cookies } from "@/utils";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const userInfo = useAppSelector(userInfoSelector);
  const token = cookies.get(COOKIE_KEY.TOKEN)?.toString();

  if (!token) return <>{children}</>

  switch (userInfo?.moduleId) {
    case AuthModule.Admin:
      return <Navigate to={PATHS.ADMIN_PRICING_PLAN} replace />
    case AuthModule.ClinicOwner:
      return <Navigate to={PATHS.CLINIC_DASHBOARD} replace />
    case AuthModule.Patient:
      return <Navigate to={PATHS.PATIENT_OVERVIEW} replace />
    default:
      return <>{children}</>
  }
  // return <>{children}</>
};

export default PublicRoute;