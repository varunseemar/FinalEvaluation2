import React from 'react'
import {useEffect,useRef} from 'react'
import styles from '../styles/PeopleAddedModal.module.css'

const PeopleAddedModal = ({addedToBoard,closePeopleAddedModal,displayPeopleAddedModal}) => {
const PeopleAddedModalContainerRef = useRef();

function checkClickOutside(e){
    if(displayPeopleAddedModal && PeopleAddedModalContainerRef.current && !PeopleAddedModalContainerRef.current.contains(e.target)){
        closePeopleAddedModal();
    }
}
useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutside)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutside)
    }
},[displayPeopleAddedModal])

  return (
    <div className={styles.PeopleAddedModalContainer} ref={PeopleAddedModalContainerRef}>
        <p className={styles.PeopleAddedtxt}>{addedToBoard} added to board</p>
        <button className={styles.PeopleAddedcancelbutton} onClick={closePeopleAddedModal}>Okay, got it!</button>
    </div>
  )
}

export default PeopleAddedModal;