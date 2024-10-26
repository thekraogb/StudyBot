import React, { useState } from "react";
import history from "../../assets/history.png";
import newchat from "../../assets/new.png";
import "./Appbar.css";
import Sidebar from "../sidebar/sidebar.jsx";
import { useSidebar } from "../../context/sidebarcontext";
import { useDispatch, useSelector } from "react-redux";
import { setChatId } from "../../app/slices/chat/chatslice";
import { setMessages } from "../../app/slices/message/messageslice";
import UserDropdown from "../dropdown/userdropdown";
import { Tooltip } from "react-tooltip";

const Appbar = () => {
  const panelWidth = 300;
  const { open, toggleSidebar } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const name = useSelector((state) => state.auth.name);
  const dispatch = useDispatch();

  const firstLetter = name ? name.charAt(0).toUpperCase() : "";

  const handleNewChatClick = () => {
    dispatch(setChatId(""));
    dispatch(setMessages([]));
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="appbar-container">
      <header
        className={"appbar"}
        style={{
          marginLeft: open ? `${panelWidth}px` : "0",
          width: open ? `calc(100% - ${panelWidth}px)` : "100%",
        }}
      >
        <div className="toolbar">
          {!open && (
            <button
              className="icon-button history-button"
              data-tooltip-id="history"
              data-tooltip-content="Chats history"
              onClick={toggleSidebar}
            >
              <img
                src={history}
                alt="History"
                style={{ width: 24, height: 24 }}
              />
            </button>
          )}
          <Tooltip id="history" />
          <h1 className="title">STUDYBOT</h1>

          <button
            className="icon-button"
            data-tooltip-id="newChat"
            data-tooltip-content="New chat"
            onClick={handleNewChatClick}
          >
            <img
              src={newchat}
              alt="New chat"
              style={{ width: 24, height: 24 }}
            />
          </button>
          <Tooltip id="newChat" />
          <div className="name-container" onClick={handleDropdownToggle}>
            <h2 className="name" style={{ padding: "1px" }}>
              {firstLetter}
            </h2>
            {isDropdownOpen && <UserDropdown />}
          </div>
        </div>
      </header>

      <Sidebar />
    </div>
  );
};

export default Appbar;
