import { PATHS } from '@/config';
import { AuthModule } from '@/enums';
import { useAppSelector } from '@/hooks';
import { userInfoSelector } from '@/store';
import AgoraUIKit from 'agora-react-uikit';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function VideoCall() {
  const location = useLocation();
  const groupID = location.state?.groupID;
  const navigate = useNavigate();
  const userInfo = useAppSelector(userInfoSelector)

  const rtcProps = {
    appId: 'a188e47a27f846e68dfd23fa9e550ea8',
    channel: groupID.toString(),
  };
  const callbacks = {
    EndCall: () => userInfo?.moduleId === AuthModule.Patient
      ? navigate(PATHS.PATIENT_CHAT) : navigate(PATHS.CLINIC_CHAT),
  };
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    </div>
  )
}