import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuth } from "@/hooks";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function VideoCall() {
    const { userInfo } = useAuth();
    const location = useLocation();
    const groupID = location.state?.groupID;
    const navigate = useNavigate();

    let myMeeting = async (element: HTMLDivElement) => {
    // generate Kit Token
    const appID = 1036177780;
    const serverSecret = "f856da2571d3cbfce4cbc3f6257d0e96";
    const userId = userInfo?.id ? userInfo.id : '';
    const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, groupID.toString(),  userId,  userInfo?.lastName);


    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
    container: element,
    sharedLinks: [
        {
        name: 'Personal link',
        url:
            window.location.protocol + '//' + 
            window.location.host + window.location.pathname +
            '?roomID=' +
            groupID,
        },
    ],
    scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
    },
    showPreJoinView: false,
    showLeavingView: true,
    onLeaveRoom: () => {navigate('/clinic/messages')}
    });


  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}