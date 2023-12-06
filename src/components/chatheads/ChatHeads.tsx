import React from "react";
import { FaEdit, FaEllipsisH, FaVideo } from "react-icons/fa";
import { IGroupChat } from "@/types"
import "./chatheads.css";

interface ChatHeadsProps {
  groups: IGroupChat[];  // danh sách các nhóm chat mà user hiện tại tham gia
  changeGroup: (group: IGroupChat) => void;  // thay đổi nhóm chat được hiển thị
}

export default function ChatHeads({ groups, changeGroup }: ChatHeadsProps) {
  return (
    <div>
      <div className="conv-header-container">
        <p className="conversations-header">Đoạn chat</p>
        <div>
          <FaEllipsisH />
          <FaVideo />
          <FaEdit />
        </div>
      </div>
      <input className="chat-heads-search" placeholder="Tìm kiếm" />
      <div className="chat-heads-container">
        {groups.map((group) => (
          <div
            key={group.id}
            className="chat-head-item"
            onClick={() => changeGroup(group)}
          >
            <div className="user-profile-pic-container">
              <p className="user-profile-pic-text">{group.groupName.slice(0, 1)}</p>
            </div>
            <p>{group.groupName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
