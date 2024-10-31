import React from 'react'
import {useEffect,useRef,useState} from 'react'
import styles from '../styles/LogoutModal.module.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const LogoutModal = ({closeLogoutModal,displayLogoutModal}) => {
const LogoutModalContainerRef = useRef();
const navigate = useNavigate();

const handleLogout = ()=>{
    toast.success("Successfully Logged Out")
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/Login')
}
function checkClickOutside(e){
    if(displayLogoutModal && LogoutModalContainerRef.current && !LogoutModalContainerRef.current.contains(e.target)){
        closeLogoutModal();
    }
}
useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutside)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutside)
    }
},[displayLogoutModal])

  return (
    <div className={styles.LogoutModalContainer} ref={LogoutModalContainerRef}>
        <p className={styles.logouttxt}>Are you sure you want to Logout?</p>
        <button className={styles.logoutbutton} onClick={handleLogout}>Yes, Logout</button>
        <button className={styles.cancelbutton} onClick={closeLogoutModal}>Cancel</button>
    </div>
  )
}

export default LogoutModal;