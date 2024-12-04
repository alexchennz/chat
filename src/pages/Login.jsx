import React, { useRef, useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value

    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (error) {
      setError(true)
      console.log(error.message)
    }
  }

  return (
    <div className='formContainer'>
        <div className="formWrapper">
            <div className="logo">My Chat</div>
            <div className="title">Login</div>
            <form onSubmit={submitHandler}>
                <input type="text" placeholder='email' ref={emailRef}/>
                <input type="password" placeholder='password' ref={passwordRef}/>
                <button>Sign In</button>
                <p>You don't have an account? <Link to="/register">Register</Link></p>
                {error && <span>The user does not exist or the name or password is incorrect</span>}
            </form>
        </div>
    </div>
  )
}
