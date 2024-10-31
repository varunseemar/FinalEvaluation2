import React from 'react'
import styles from '../styles/TaskShare.module.css'
import promanage from '../images/promanage.png'
import { useState,useEffect } from 'react'
import tick from '../images/tick.png'
import notick from '../images/notick.png'
import {fetchTaskById} from '../services/task.js'
import { useParams } from 'react-router-dom';

const TaskShare = () => {
const {taskId} = useParams();
const [task, setTask] = useState({
    title: '',
    priority: '',
    checklists: [],
    dueDate: null,
});
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
const fetchTask = async()=>{
    const taskData = await fetchTaskById({taskId});
    const fetchedTaskData = {
        title: taskData.title || '',
        priority: taskData.priority || '',
        checklists: taskData.checklistarray || [],
        dueDate: taskData.dueDate || null,
    };
    setTask(fetchedTaskData);
};

useEffect(()=>{
    fetchTask();
},[taskId])

  return (
    <div>
        <div className={styles.promanageshare}>
            <span><img src={promanage}></img><p>Pro Manage</p></span>
        </div>
        <div className={styles.taskdivshare}>
            <div className={styles.taskprioritymenushare}>
                <p className={task.priority === 'low' ? styles.TaskPriorityLowdotshare : task.priority === 'moderate' ? styles.TaskPriorityModeratedotshare : task.priority === 'high' ? styles.TaskPriorityHighdotshare : ""}></p>
                <p className={styles.TaskPriorityshare}>&nbsp;&nbsp;{task.priority.toUpperCase()} PRIORITY</p>
            </div>
            <div className={styles.tasktitleshare}>
                <p className={styles.Tasktitletextshare}>{task.title}</p>
            </div>
            <div className={styles.checklistaccordionshare}>
                <p className={styles.checklistaccordiontextshare}>
                    Checklist&nbsp;({task.checklists.filter((item) => item.checked).length}/{task.checklists.length})
                </p>
            </div>
            <div className={styles.taskchecklistitemshare}>
                {task.checklists.map((listitem)=>(
                    <div key={listitem._id} className={styles.checklistItemshare}>
                        <img src={listitem.checked ? tick : notick}></img>
                        <p className={styles.checklisttitleshare}>{listitem.title}</p>
                    </div>
                ))}
            </div>
            {task.dueDate !== null ? <div className={styles.taskduedatedivshare}>
              <p className={styles.taskduedatetextshare}>Due Date&nbsp;&nbsp;</p>
              <div className={styles.taskduedatecolordivshare}>
                <p className={styles.taskduedatecolortextshare}>
                    {task.dueDate ? getDueDate(task.dueDate) : 'No Date'}
                </p>
              </div>
            </div> : ""}
        </div>
    </div>
  )
}

export default TaskShare;