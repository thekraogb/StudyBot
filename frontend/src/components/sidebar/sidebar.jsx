import { useEffect, useState } from "react";
import { useSidebar } from "../../context/sidebarcontext.jsx";
import "./sidebar.css";
import trash from "../../assets/trash.svg";
import history from "../../assets/history.png";
import DeleteModal from "../../components/modal/deletemodal.jsx";
import { successToast, errorToast } from "../../toastify/toastify.jsx";

import { useDispatch, useSelector } from "react-redux";
import {
  setChatId,
  removeChat,
  setChats,
} from "../../app/slices/chat/chatslice";
import { setMessages } from "../../app/slices/message/messageslice";
import {
  useDeleteChatMutation,
  useFetchChatsQuery,
} from "../../app/slices/chat/chatapislice";
import { useFetchMessagesQuery } from "../../app/slices/message/messageapislice";
import { Tooltip } from "react-tooltip";

const Sidebar = () => {
  const { open, toggleSidebar } = useSidebar();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const chatId = useSelector((state) => state.chat.chatId);
  const chats = useSelector((state) => state.chat.chats);
  const [deleteChat] = useDeleteChatMutation();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const { data: fetchedChats = [], refetch: fetchChats } = useFetchChatsQuery();
  const { data: fetchedMessages, error } = useFetchMessagesQuery(
    selectedChatId,
    {
      skip: !selectedChatId,
    }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const updateChats = async () => {
      const { data } = await fetchChats();
      if (data) {
        dispatch(setChats(data.data));
      }
    };

    updateChats();
  }, [chatId]);

  useEffect(() => {
    if (error) {
      errorToast("error fetching messages");
    }
    if (fetchedMessages) {
      dispatch(setMessages(fetchedMessages.data || []));
      dispatch(setChatId(selectedChatId));
    }
  }, [fetchedMessages, dispatch]);

  const handleChatClick = (chat) => {
    setSelectedChatId(chat._id);
  };

  const handleDeleteClick = (chat) => {
    setSelectedChat(chat);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedChat) {
      try {
        const result = await deleteChat(selectedChat._id).unwrap();
        if (result.success) {
          successToast(result.message);
          dispatch(removeChat(selectedChat._id));

          if (selectedChat._id === chatId) {
            dispatch(setChatId(""));
            dispatch(setMessages([]));
          }
        } else {
          errorToast(result.message);
        }
      } catch (error) {
        errorToast("error deleting chat");
      } finally {
        setShowDeleteModal(false);
        setSelectedChat(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedChat(null);
  };

  return (
    <div className={`sidebar ${open ? "show" : ""}`}>
      {open && (
        <button
          className="icon-button history-button"
          data-tooltip-id="history"
          data-tooltip-content="Chats history"
          onClick={toggleSidebar}
          style={{
            position: "absolute",
            left: "2%",
            top: "2.5%",
          }}
        >
          <img src={history} alt="History" style={{ width: 24, height: 24 }} />
        </button>
      )}
      <Tooltip id="history" />
      <div className="chat-list">
        {chats.length > 0 ? (
          <>
            {chats.map((chat, index) => (
              <div
                className="chat-item"
                key={index}
                onClick={() => handleChatClick(chat)}
              >
                <span className="chat-text">
                  {chat.title ? chat.title : "New chat"}
                </span>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(chat);
                  }}
                >
                  <img src={trash} alt="Delete" />
                </button>
              </div>
            ))}
          </>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: "1rem",
              marginTop: "15%",
            }}
          >
            No chats yet.
          </p>
        )}
      </div>

      <DeleteModal
        show={showDeleteModal}
        onCancel={handleCancelDelete}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default Sidebar;
