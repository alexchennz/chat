import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

export default function Message({message}) {
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext)

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const timeSent = new Date(message.date.toDate()).toLocaleString()

  return (
    <div className={`message ${message.senderID === currentUser.uid ? "owner" : ""}`} ref={ref}>
      <div className="messageInfo">
        <img src={currentUser.photoURL} alt="" />
        <span>{timeSent}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {/* <img src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" /> */}
      </div>
    </div>
  )
}
