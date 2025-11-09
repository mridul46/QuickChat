import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [message, setMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { socket, axios } = useContext(AuthContext);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/v1/messages/users");
      console.log("API Response:", data);
      if (data.success) {
        setUsers(data.users || []);
        setUnseenMessages(data.unseenMessages || {});
      } else{
        console.error("API did not return success:", data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/v1/messages/${userId}`);
      if (data.success) setMessage(data.messages);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const sendMessage = async (messageData) => {
  //   try {
  //     const { data } = await axios.post(
  //       `/api/v1/messages/send/${selectedUser._id}`,
  //       messageData
  //     );
  //     if (data.success) {
  //       setMessage((prev) => [...prev, data.newMessage]);
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const sendMessage = async (messageData) => {
  if (!selectedUser?._id) {
    toast.error("No user selected");
    return;
  }
  try {
    const { data } = await axios.post(
      `/api/v1/messages/send/${selectedUser._id}`,
      messageData,
    );
    if (data.success) {
      setMessage((prev) => [...prev, data.newMessage]);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};


  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessage((prev) => [...prev, newMessage]);
        axios.put(`/api/v1/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]:
            prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessage = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return unsubscribeFromMessage;
  }, [socket, selectedUser]);

  const value = {
    message,
    users,
    selectedUser,
    getUsers,
    setMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
