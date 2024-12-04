import React, { useContext, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';


export default function Search() {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(false)
  const {currentUser} = useContext(AuthContext)

  

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch()
  }

  const handleSearch = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", username));
    try {
      const querySnapshot = await getDocs(q);
      // console.log(querySnapshot)
      if(querySnapshot.empty){
        setError(true)
      }
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      });
      
    } catch (error) {
      setError(true)
      console.log(error)
    }
  }

  const handleSelect = async () => {
    const combineID = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid
    try {
      const res = await getDoc(doc(db, "chats", combineID))
      if(!res.exists()){
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combineID), {messages:[]})
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combineID + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
          },
          [combineID + ".date"]: serverTimestamp(),
        })

        await updateDoc(doc(db, "userChats", user.uid), {
          [combineID + ".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
          },
          [combineID + ".date"]: serverTimestamp(),
        })
      }
    } catch (error) {
      console.log(error)
    }

    setUser(null)
    setUsername("")
  }

  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" value={username} placeholder='Find a user' onKeyDown={handleKey} onChange={(e) => setUsername(e.target.value)} />
      </div>
      {error && <span style={{padding: "10px"}}>User not found!</span>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}
