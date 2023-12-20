import AgoraUIKit from 'agora-react-uikit';
import { useAuth } from "@/hooks";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, {useState} from 'react';

export default function VideoCall() {
  const { userInfo } = useAuth();
  const location = useLocation();
  const groupID = location.state?.groupID;
  const navigate = useNavigate();

  const rtcProps = {
    appId: 'a188e47a27f846e68dfd23fa9e550ea8', 
    channel: groupID.toString(), 
    
  };
  const callbacks = {
    EndCall: () => navigate('/clinic/messages'),
  };
  return (
    <div style={{display: 'flex', width: '100vw', height: '100vh'}}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    </div>
  ) 
}