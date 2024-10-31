import React from 'react'
import { useState, useEffect } from 'react';
import styles from '../styles/Analytics.module.css'
import {fetchUserTasks} from '../services/task.js'
 
const Analytics =()=>{
  const [taskCounts,setTaskCounts] = useState({
    backlog: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    low: 0,
    moderate: 0,
    high: 0,
    dueDateTasks: 0,
  });

  useEffect(()=>{
    const fetchTasks = async()=>{
      try{
        const email = localStorage.getItem('email');
        const boarddatefilter = 'null';
        const tasks = await fetchUserTasks({email,boarddatefilter});
        const tempCounts ={
          backlog: 0,
          todo: 0,
          inProgress: 0,
          done: 0,
          low: 0,
          moderate: 0,
          high: 0,
          dueDateTasks: 0,
        };
        tasks.forEach(task => {
          tempCounts[task.status] = (tempCounts[task.status] || 0) + 1;
          tempCounts[task.priority] = (tempCounts[task.priority] || 0) + 1;
          if(task.dueDate){
            tempCounts.dueDateTasks++;
          }
        });
        setTaskCounts(tempCounts);
      } 
      catch(error){
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  },[]);

  return(
    <div>
      <div className={styles.upperAnalytics}>
        <p>Analytics</p>
      </div>
      <div className={styles.lowerAnalytics}>
        <div className={styles.lowerleftAnalytics}>
          <ul>
            <li>Backlog Tasks<span>{taskCounts.backlog}</span></li>
            <li>To-do Tasks<span>{taskCounts.todo}</span></li>
            <li>In-Progress Tasks<span>{taskCounts.inProgress}</span></li>
            <li>Completed Tasks<span>{taskCounts.done}</span></li>
          </ul>
        </div>
        <div className={styles.lowerrightAnalytics}>
          <ul>
            <li>Low Priority<span>{taskCounts.low}</span></li>
            <li>Moderate Priority<span>{taskCounts.moderate}</span></li>
            <li>High Priority<span>{taskCounts.high}</span></li>
            <li>Due Date Tasks<span>{taskCounts.dueDateTasks}</span></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Analytics;