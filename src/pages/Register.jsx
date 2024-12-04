import React, { useRef, useState } from 'react'
import Add from '../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../firebase';
import { doc, setDoc } from "firebase/firestore"; 
import { Link, useNavigate } from 'react-router-dom';



export default function Register() {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const fileRef = useRef()

  const demoURL = "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=600"

  const [error, setError] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const displayName = nameRef.current.value
    const email = emailRef.current.value
    const password = passwordRef.current.value
    const file = fileRef.current.files[0]
    
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up 
        const user = userCredential.user;

        await updateProfile(user, {
          displayName,
          photoURL: demoURL,
        });
        
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName,
          email,
          photoURL: demoURL,
          // photoURL: downloadURL,
        });

        await setDoc(doc(db, "userChats", user.uid), {});

        navigate("/")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

      

    } catch (error) {
      setError(true)
    }
    
  }
  return (
    <div className='formContainer'>
        <div className="formWrapper">
            <div className="logo">My Chat</div>
            <div className="title">Register</div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='display name' ref={nameRef}/>
                <input type="text" placeholder='email' ref={emailRef}/>
                <input type="password" placeholder='password' ref={passwordRef}/>
                <input style={{display:"none"}} type="file" id='file' ref={fileRef} />
                {/* <label htmlFor="file">
                    <img src={Add} alt="" />
                    <span>Add an avatar</span>
                </label> */}
                <button>Sign Up</button>
                <p>You do have an account? <Link to="/login">Login</Link></p>
                {error && <span>Something went wrong</span>}
            </form>
        </div>
    </div>
  )
}
