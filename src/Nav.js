import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Nav.css'

function Nav() {
  const [show, setShow] = useState(false)
  const history = useNavigate()

  const transitionNavBar = () => {
    if(window.scrollY > 100) {
      setShow(true)
    } else {
      setShow(false)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar)
    return () => window.removeEventListener("scroll", transitionNavBar)
  },[])

  return (
    <div className={`nav ${show && "nav__black"}`}>
        <div className='nav__contents'>
          <img onClick={() => history('/')} className='nav__logo' src='https://static.vecteezy.com/system/resources/thumbnails/019/956/187/small/netflix-transparent-netflix-free-free-png.png'
              alt='' />

          <img 
              onClick={() => history('/profile')}
              className='nav__avatar' src='https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
              alt='' />
        </div>
       
    </div>
  )
}

export default Nav