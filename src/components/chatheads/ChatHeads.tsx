import React from "react";
import { FaEdit, FaEllipsisH, FaVideo } from "react-icons/fa";
import { ChatHeadsUser } from "@/types"
import "./chatheads.css";

export default function ChatHeads({ items, setReceiver }: any) {
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
        {items.map((obj:ChatHeadsUser, i:number) => (
          <div
            key={i}
            className="chat-head-item"
            onClick={() => setReceiver(obj)}
          >
            <div className="user-profile-pic-container">
              <p className="user-profile-pic-text">{obj.email[0]}</p>
            </div>
            <p>{obj.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
