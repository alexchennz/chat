import React, { useContext, useState } from 'react'
import Img from '../img/img.png'
import Attach from '../img/attach.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { doc, updateDoc, arrayUnion, Timestamp, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import { v4 as uuid } from 'uuid';


export default function Input() {
  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)

  const [text, setText] = useState("")
  // const [img, setImg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(data.chatID)
    // if(img){

    // }
    // else{
      await updateDoc(doc(db, "chats", data.chatID), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderID: currentUser.uid,
          date: Timestamp.now()
        })
      });
    // }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatID + ".lastMessage"]: {
        text,
      },
      [data.chatID + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatID + ".lastMessage"]: {
        text,
      },
      [data.chatID + ".date"]: serverTimestamp(),
    });

    // setImg(null)
    setText("")
  }

  return (
    <div className="input">
      <input type="text" placeholder='Type something...' onChange={(e) => setText(e.target.value)} value={text} />
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{display:"none"}} id='file' onChange={(e) => setImg(e.target.files[0])}/>
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  )
}
