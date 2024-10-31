import React from 'react'
import {useEffect,useRef,useState} from 'react'
import styles from '../styles/Delete.module.css'
import {deleteTask} from '../services/task.js'

const DeleteModal = ({handleRefresh,deleteTaskId,closeDeleteModal,displayDeleteModal}) => {
const DeleteModalContainerRef = useRef();

function checkClickOutside(e){
    if(displayDeleteModal && DeleteModalContainerRef.current && !DeleteModalContainerRef.current.contains(e.target)){
        closeDeleteModal();
    }
}
async function handleDeleteTask(){
    const taskId = deleteTaskId;
    const response = await deleteTask({taskId});
    if(response.status === 200){
      console.log("Deleted Successfully")
      handleRefresh();
    }
    closeDeleteModal();
}
useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutside)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutside)
    }
},[displayDeleteModal])

  return (
    <div className={styles.DeleteModalContainer} ref={DeleteModalContainerRef}>
        <p className={styles.Deletetxt}>Are you sure you want to Delete?</p>
        <button className={styles.Deletebutton} onClick={handleDeleteTask}>Yes, Delete</button>
        <button className={styles.Deletecancelbutton} onClick={closeDeleteModal}>Cancel</button>
    </div>
  )
}

export default DeleteModal;