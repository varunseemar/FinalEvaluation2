import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles/App.module.css'
import promanage from './images/promanage.png'
import board from './images/board.png'
import analytics from './images/analytics.png'
import settings from './images/settings.png'
import logout from './images/logout.png'
import Board from './components/Board.jsx'
import Analytics from './components/Analytics.jsx'
import Settings from './components/Settings.jsx'
import LogoutModal from './modal/LogoutModal.jsx'
import DeleteModal from './modal/Delete.jsx'
import AddPeopleModal from './modal/AddPeopleModal.jsx'
import PeopleAddedModal from './modal/PeopleAddedModal.jsx'
import AddTaskModal from './modal/AddTaksModal.jsx'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const [displayBoard,setDisplayBoard] = useState(true);
  const [displayAnalytics,setDisplayAnalytics] = useState(false);
  const [displaySettings,setDisplaySettings] = useState(false);
  const [displayLogoutModal,setDisplayLogoutModal] = useState(false);
  const [displayDeleteModal,setDisplayDeleteModal] = useState(false);
  const [displayAddPeopleModal,setDisplayAddPeopleModal] = useState(false);
  const [displayPeopleAddedModal,setDisplayPeopleAddedModal] = useState(false);
  const [displayAddTaskModal,setDisplayAddTaskModal] = useState(false);
  const [editTask,setEditTask] = useState(false);
  const [editTaskId,setEditTaskId] = useState(null);
  const [deleteTaskId,setDeleteTaskId] = useState(null);
  const [isModalOpen,setIsModalOpen] = useState();
  const [refresh,setRefresh] = useState(0);
  const [addedToBoard,setAddedToBoard] = useState(null);
  const navigate = useNavigate();

  const handleRefresh = ()=>{
    setRefresh(refresh+1);
  }
  const resetEditTask = () => {
    setEditTask(false);
    setEditTaskId(null);
  };
  const handleBoardClick = ()=>{
    setDisplayBoard(true);
    setDisplayAnalytics(false);
    setDisplaySettings(false);
    
  }
  const handleAnalyticsClick = ()=>{
    setDisplayBoard(false);
    setDisplayAnalytics(true);
    setDisplaySettings(false);
  }
  const handleSettingsClick = ()=>{
    setDisplayBoard(false);
    setDisplayAnalytics(false);
    setDisplaySettings(true);
  }
  function openLogoutModal(){
    setDisplayLogoutModal(true);
    setIsModalOpen('Logout');
  }
  function closeLogoutModal(){
    setDisplayLogoutModal(false);
    setIsModalOpen();
  }
  function openDeleteModal(){
    setDisplayDeleteModal(true);
    setIsModalOpen('Delete');
  }
  function closeDeleteModal(){
    setDisplayDeleteModal(false);
    setIsModalOpen();
  }
  function openAddPeopleModal(){
    setDisplayAddPeopleModal(true);
    setIsModalOpen('AddPeople');
  }
  function closeAddPeopleModal(){
    setDisplayAddPeopleModal(false);
    setIsModalOpen();
  }
  function openPeopleAddedModal(){
    setDisplayPeopleAddedModal(true);
    setIsModalOpen('PeopleAdded');
  }
  function closePeopleAddedModal(){
    setDisplayPeopleAddedModal(false);
    setAddedToBoard(null);
    setIsModalOpen();
  }
  function openAddTaskModal(){
    setDisplayAddTaskModal(true);
    setIsModalOpen('AddTask');
  }
  function closeAddTaskModal(){
    setDisplayAddTaskModal(false);
    setIsModalOpen();
  }

  useEffect(()=>{
    if(!localStorage.getItem('email')){
      navigate('/Login');
    }
  },[])

  return(
  <>
    <Toaster />
    {isModalOpen === 'Logout' && displayLogoutModal
      ? <div className={styles.LogoutModal}> <LogoutModal closeLogoutModal={closeLogoutModal} displayLogoutModal={displayLogoutModal} /> </div> 
      : ""}
    {isModalOpen === 'Delete' && displayDeleteModal
      ? <div className={styles.DeleteModal}> <DeleteModal handleRefresh={handleRefresh} deleteTaskId={deleteTaskId} closeDeleteModal={closeDeleteModal} displayDeleteModal={displayDeleteModal} /> </div> 
      : ""}
    {isModalOpen === 'AddPeople' && displayAddPeopleModal
      ? <div className={styles.AddPeopleModal}> <AddPeopleModal openPeopleAddedModal={openPeopleAddedModal} setAddedToBoard={setAddedToBoard} closeAddPeopleModal={closeAddPeopleModal} displayAddPeopleModal={displayAddPeopleModal} /> </div> 
      : ""}
    {isModalOpen === 'PeopleAdded' && displayPeopleAddedModal && addedToBoard !== null
      ? <div className={styles.PeopleAddedModal}> <PeopleAddedModal addedToBoard={addedToBoard} closePeopleAddedModal={closePeopleAddedModal} displayPeopleAddedModal={displayPeopleAddedModal} /> </div> 
      : ""}
    {isModalOpen === 'AddTask' && displayAddTaskModal
      ? <div className={styles.AddTaskModal}> <AddTaskModal resetEditTask={resetEditTask} editTaskId={editTaskId} editTask={editTask} handleRefresh={handleRefresh} closeAddTaskModal={closeAddTaskModal} displayAddTaskModal={displayAddTaskModal} /> </div> 
      : ""}
    <div className={styles.main}>
      <div className={styles.leftLayout}>
        <div className={styles.promanage}>
          <span><img src={promanage}></img><p>Pro Manage</p></span>
        </div>
        <div className={displayBoard ? styles.boardSelected : styles.board} onClick={handleBoardClick}>
          <span><img src={board}></img><p>Board</p></span>
        </div>
        <div className={displayAnalytics ? styles.analyticsSelected : styles.analytics} onClick={handleAnalyticsClick}>
          <span><img src={analytics}></img><p>Analytics</p></span>
        </div>
        <div className={displaySettings ? styles.settingsSelected : styles.settings} onClick={handleSettingsClick}>
          <span><img src={settings}></img><p>Settings</p></span>
        </div>
        <div className={styles.logout} onClick={openLogoutModal}>
          <span><img src={logout}></img><p>Logout</p></span>
        </div>
      </div>
      <div className={styles.rightLayout}>
        {displayBoard && <Board openDeleteModal={openDeleteModal} setDeleteTaskId={setDeleteTaskId} setEditTaskId={setEditTaskId} setEditTask={setEditTask} handleRefresh={handleRefresh} refresh={refresh} openAddPeopleModal={openAddPeopleModal} openAddTaskModal={openAddTaskModal} />}
        {displayAnalytics && <Analytics />}
        {displaySettings && <Settings />}
      </div>
    </div>
  </>
  )
}

export default App;
