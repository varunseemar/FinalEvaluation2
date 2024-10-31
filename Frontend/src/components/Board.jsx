import React from 'react'
import {useEffect,useRef,useState} from 'react'
import styles from '../styles/Board.module.css'
import add from '../images/add.png'
import addgroup from '../images/addgroup.png'
import collapse from '../images/collapse.png'
import dot from '../images/dots.png'
import openaccordion from '../images/openaccordion.png'
import closeaccordion from '../images/closeaccordion.png'
import {fetchUserTasks} from '../services/task.js'
import {updateTaskStatus} from '../services/task.js'
import {updateChecklistItemStatus} from '../services/task.js'

const Board = ({openDeleteModal,setDeleteTaskId,setEditTaskId,setEditTask,handleRefresh,refresh,openAddPeopleModal,openAddTaskModal}) => {
  const [date,setDate] = useState();
  const [tasks, setTasks] = useState([]);
  const [dropdown,setDropdown] = useState('week');
  const [taskStates, setTaskStates] = useState({
    backlog: {collapsed: false,tasks: {}},
    todo: {collapsed: false,tasks: {}},
    inProgress: {collapsed: false,tasks: {}},
    done: {collapsed: false,tasks: {}},
  });
  const [linkCopyActive,setLinkCopyActive] = useState(false);
  const [menuActive, setMenuActive] = useState(null);
  const menuContainerRef = useRef();
  let user = localStorage.getItem('username');
  let capitaledUser = capitalizeFirstLetter(user);

  const toggleCategoryCollapse = (category)=>{
    setTaskStates((prevStates)=>({
      ...prevStates,
      [category]:{
        collapsed: !prevStates[category].collapsed,
        tasks: Object.keys(prevStates[category].tasks).reduce((acc, taskId)=>{
          acc[taskId] = {accordionActive: !prevStates[category].collapsed ? false : prevStates[category].tasks[taskId].accordionActive};
          return acc;
        },{}),
      },
    }));
  };
  function capitalizeFirstLetter(string){
    return string?.charAt(0)?.toUpperCase() + string?.slice(1)
  }
  function formatDate(){
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const daySuffix = getDaySuffix(day);
    return `${day}${daySuffix} ${month}, ${year}`;
  }
  function getDaySuffix(day){
    if (day > 3 && day < 21) return 'th'; 
    switch(day % 10){
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
  function getDueDate(duedate){
    const dateObj = new Date(duedate);
    const month = dateObj.toLocaleDateString('default', {month: 'short'})
    const day = dateObj.getDate()
    const daySuffix = getDaySuffix(day);
    return `${month} ${day}${daySuffix}`;
  }
  const toggleMenu =(taskId)=>{
    setMenuActive((prev)=>(prev === taskId ? null : taskId));
  };
  const toggleLinkCopied =(taskId)=>{
    const currentUrl = `${window.location.origin}/task/${taskId}`;
    navigator.clipboard.writeText(currentUrl)
      .then(()=>{
          setLinkCopyActive(!linkCopyActive);
          console.log('Task URL copied to clipboard:');
      })
      .catch(err=>{
          console.error('Failed to copy: ');
      });
    setMenuActive(null);
    setTimeout(()=>{
      setLinkCopyActive(false);
    },2000)
  };
  const toggleAccordion = (taskId, category) => {
    setTaskStates((prevStates) => ({
      ...prevStates,
      [category]: {
        ...prevStates[category],
        tasks: {
          ...prevStates[category].tasks,
          [taskId]: {
            accordionActive: !prevStates[category].tasks[taskId]?.accordionActive,
          },
        },
      },
    }));
  };
  async function handleStatusChange(taskId,newStatus){
    const updatedTask = await updateTaskStatus({taskId,newStatus});
    if(updatedTask){
      fetchTasks();
    }
  }
  const fetchTasks = async()=>{
    let email = localStorage.getItem('email');
    let boarddatefilter = dropdown;
    const response = await fetchUserTasks({email,boarddatefilter});
    setTasks(response);
  };
  
  useEffect(()=>{
    let currDate = formatDate();
    setDate(currDate);
    fetchTasks();
  },[refresh,dropdown])

  function checkClickOutside(e){
    if(menuActive && menuContainerRef.current && !menuContainerRef.current.contains(e.target)){
      setMenuActive(null);
    }
  }
  useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutside)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutside)
    }
  },[menuActive])
  function isDueDatePast(dueDate){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }
  function handleDeleteTask(taskId){
    setMenuActive(null);
    setDeleteTaskId(taskId);
    openDeleteModal();
  }
  const handleEdit =(taskId,e)=>{
    e.stopPropagation();
    setEditTask(true);
    setEditTaskId(taskId);
    setMenuActive(null);
    openAddTaskModal();
  }
  const handleDropdownChange = (e) =>{
    setDropdown(e.target.value);
  };
  const handleCheckboxChange =async(taskId, checklistItemId)=>{
    const updatedTasks = tasks.map((task) => {
      if(task._id === taskId){
        const updatedChecklist = task.checklistarray.map((item) => 
          item._id === checklistItemId ? {...item, checked: !item.checked} : item
        );
        return{...task,checklistarray: updatedChecklist};
      }
      return task;
    });
    setTasks(updatedTasks);
    const checked = updatedTasks
      .find(task => task._id === taskId)
      .checklistarray.find(item => item._id === checklistItemId).checked;
    const success = await updateChecklistItemStatus({taskId,checklistItemId,checked});
    if(!success){
      setTasks(tasks);
      console.error("Failed to update checklist item in the database");
    }
  };

  const renderTasks =(status)=>{
    return tasks.filter((task)=>task.status === status).map((task)=>(
        <div key={task._id} className={styles.taskmaindiv}>
          <div className={styles.taskprioritymenu}>
            <p className={task.priority === 'low' ? styles.TaskPriorityLowdot : task.priority === 'moderate' ? styles.TaskPriorityModeratedot : task.priority === 'high' ? styles.TaskPriorityHighdot : ""}></p>
            <p className={task.priority === 'moderate' ? styles.TaskPriorityModerate : styles.TaskPriority}>&nbsp;&nbsp;{task.priority.toUpperCase()} PRIORITY</p>
            <div onClick={() => toggleMenu(task._id)}>
              <img src={dot} />
            </div>
          </div>
          {menuActive === task._id && (
            <div className={styles.taskmenumaindiv} ref={menuContainerRef}>
              <p className={styles.taskmenuedit} onClick={(e)=>handleEdit(task._id,e)}>Edit</p>
              <p className={styles.taskmenushare} onClick={()=>toggleLinkCopied(task._id)}>Share</p>
              <p className={styles.taskmenudelete} onClick={()=>handleDeleteTask(task._id)}>Delete</p>
            </div>
          )}
          <div className={styles.tasktitle}>
            <p className={styles.Tasktitletext}>{task.title}</p>
          </div>
          <div className={styles.checklistaccordion}>
            <p className={styles.checklistaccordiontext}>
              Checklist&nbsp;({task.checklistarray.filter((item) => item.checked).length}/{task.checklistarray.length})
            </p>
            <img src={taskStates[status].tasks[task._id]?.accordionActive ? closeaccordion : openaccordion} onClick={() => toggleAccordion(task._id,status)} />
          </div>
          {taskStates[status].tasks[task._id]?.accordionActive && (
            <div className={styles.taskchecklistitem}>
              {task.checklistarray.map((checkItem)=>(
                <div key={checkItem._id} className={styles.checklistItem}>
                  <div className={styles.checkboxContainerboard} onClick={()=>handleCheckboxChange(task._id,checkItem._id)}>
                    <input
                      type='checkbox'
                      checked={checkItem.checked}
                      className={styles.checkboxchecklistboard}
                      readOnly
                    />
                    <span className={styles.customCheckboxboard} style={{ backgroundColor: checkItem.checked ? "#17A2B8" : "transparent" }}>
                        {checkItem.checked && <span className={styles.checkmarkboard}></span>}
                    </span>
                  </div>
                  <p className={styles.checklisttitleboard}>{checkItem.title}</p>
                </div>
              ))}
            </div>
          )}
          <div className={task.dueDate !== null ? styles.taskduedatestatus : styles.taskduedatestatuswithoutduedate}>
            {task.dueDate !== null ? <div className={task.status === 'done' ? styles.taskduedatestatusduedateGreen : task.priority === 'high' ? styles.taskduedatestatusduedateRed : isDueDatePast(new Date(task.dueDate)) ? styles.taskduedatestatusduedateRed : styles.taskduedatestatusduedate}>
              <p className={task.priority === 'high' || task.status === 'done' || isDueDatePast(new Date(task.dueDate)) ? styles.taskduedatestatusduedatetextWhite : styles.taskduedatestatusduedatetext}>
                {task.dueDate ? getDueDate(task.dueDate) : 'No Date'}
              </p>
            </div> : ""}
            <div className={styles.taskstatusdiv}>
              {task.status !== 'inProgress' && <div className={styles.taskduedatestatusdiv} onClick={() => handleStatusChange(task._id,'inProgress')}>
                <p className={styles.taskduedatestatustext}>PROGRESS</p>
              </div>}
              {task.status !== 'todo' && <div className={styles.taskduedatestatusdiv} onClick={() => handleStatusChange(task._id,'todo')}>
                <p className={styles.taskduedatestatustext}>TO-DO</p>
              </div>}
              {task.status !== 'done' && <div className={styles.taskduedatestatusdiv} onClick={() => handleStatusChange(task._id,'done')}>
                <p className={styles.taskduedatestatustext}>DONE</p>
              </div>}
              {task.status !== 'backlog' && <div className={styles.taskduedatestatusdiv} onClick={() => handleStatusChange(task._id,'backlog')}>
                <p className={styles.taskduedatestatustext}>BACKLOG</p>
              </div>}
            </div>
          </div>
        </div>
      ));
  };

  return (
    <div className={styles.mainBoard}>
      <div className={styles.upperBoard}>
        <p className={styles.welcometxt}>Welcome!&nbsp;{capitaledUser}</p>
        {linkCopyActive && <div className={styles.linkCopiedToast}>
          <p className={styles.linkCopiedToasttxt}>Link Copied</p>
        </div>}
        <p className={styles.datetxt}>{date}</p>
        <span className={styles.spanupper}><p className={styles.boardtxt}>Board</p><img onClick={openAddPeopleModal} src={addgroup}></img><p onClick={openAddPeopleModal} className={styles.addpeopletxt}>Add People</p>
          <select value={dropdown} onChange={handleDropdownChange} className={styles.dropdownmenu}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </span>
      </div>
      <div className={styles.lowerBoard}>
        <div className={styles.backlog}>
          <div className={styles.uppernames}>
            <p>Backlog</p>
            <img src={collapse} onClick={() => toggleCategoryCollapse('backlog')}></img>
          </div>
          <div className={styles.tasklistBacklog}>
            {renderTasks('backlog')}
          </div>
        </div>
        <div className={styles.todo}>
          <div className={styles.uppernamestodo}>
            <p>To Do</p>
            <img src={add} className={styles.uppernamestodoadd} onClick={openAddTaskModal}></img>
            <img src={collapse} className={styles.uppernamestodocollapse} onClick={() => toggleCategoryCollapse('todo')}></img>
          </div>
          <div className={styles.tasklistTodo}>
            {renderTasks('todo')}
          </div>
        </div>
        <div className={styles.inprogress}>
          <div className={styles.uppernames}>
            <p>In Progress</p>
            <img src={collapse} onClick={() => toggleCategoryCollapse('inProgress')}></img>
          </div>
          <div className={styles.tasklistInprogress}>
            {renderTasks('inProgress')}
          </div>
        </div>
        <div className={styles.done}>
          <div className={styles.uppernames}>
            <p>Done</p>
            <img src={collapse} onClick={() => toggleCategoryCollapse('done')}></img>
          </div>
          <div className={styles.tasklistDone}>
            {renderTasks('done')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Board;