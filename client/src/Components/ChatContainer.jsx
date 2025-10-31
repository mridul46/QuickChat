import React from 'react'
import assets from '../assets/assets'

const ChatContainer = () => {
  return (
    <div className='flex tems-center gap-3 py-3  mx-4 border-b border-stone-500'>
        <img src={assets.profile_martin} alt="" className='w-8 rounded-full' />
    </div>
  )
}

export default ChatContainer