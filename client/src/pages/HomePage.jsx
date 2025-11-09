import React, { useContext } from 'react'
import Sidebar from '../Components/Sidebar'
import ChatContainer from '../Components/ChatContainer'
import RightSidebar from '../Components/RightSidebar'
import { ChatContext } from '../context/ChatContext'

const HomePage = () => {
  const { selectedUser, setSelectedUser } = useContext(ChatContext);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#0B0C10]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl 
        overflow-hidden relative grid 
        w-[95%] h-[90vh] sm:w-[85%] sm:h-[80vh] lg:w-[75%] lg:h-[85vh]
        ${selectedUser
          ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
          : 'md:grid-cols-2'
        }`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  )
}

export default HomePage
