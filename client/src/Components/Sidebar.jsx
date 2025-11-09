import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } =
    useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // ✅ added
  const navigate = useNavigate();

  // Filter users safely
  const filteredUsers = input
    ? (users || []).filter((user) =>
        user.fullName?.toLowerCase().includes(input.toLowerCase())
      )
    : users || [];

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        {/* Header section */}
        <div className="flex justify-between items-center relative">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          {/* ✅ Menu Button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-md hover:bg-[#282142]/50 transition"
          >
            <img src={assets.menu_icon} alt="Menu" className="max-h-5 cursor-pointer" />
          </button>

          {/* ✅ Dropdown Menu */}
          {menuOpen && (
            <div className="absolute top-full right-0 z-20 w-40 p-3 mt-2 rounded-md bg-[#282142] border border-gray-600 text-gray-100 shadow-lg animate-fadeIn">
              <p
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
                className="cursor-pointer text-sm py-2 hover:text-violet-400"
              >
                 Edit Profile
              </p>
              <hr className="border-gray-600" />
              <p
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="cursor-pointer text-sm py-2 hover:text-red-400"
              >
                 Logout
              </p>
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* User list */}
      <div className="flex flex-col">
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer transition max-sm:text-sm ${
                selectedUser?._id === user._id ? "bg-[#282142]/50" : "hover:bg-[#282142]/30"
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt=""
                className="w-[35px] aspect-square rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p>{user.fullName || "Unnamed User"}</p>
                {onlineUsers?.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-gray-400 text-xs">Offline</span>
                )}
              </div>
              {unseenMessages?.[user._id] > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-5 text-sm">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
