import React from 'react'
import {useEffect,useRef,useState} from 'react'
import DatePicker from 'react-datepicker';
import styles from '../styles/AddTaksModal.module.css'
import 'react-datepicker/dist/react-datepicker.css'
import deletelist from '../images/Delete.png'
import {postTask} from '../services/task.js'
import {updateTask} from '../services/task.js';
import axios from 'axios';
import {BACKEND_URL} from '../constants/constants.js';
import {fetchAllUsers} from '../services/auth.js'

const AddTaskModal = ({resetEditTask,editTaskId,editTask,handleRefresh,closeAddTaskModal,displayAddTaskModal}) => {
const [selectedDate, setSelectedDate] = useState(null);
const [allEmails, setAllEmails] = useState([]);
const [loading,setLoading] = useState(false);
const [selectedPriority, setSelectedPriority] = useState("");
const [checklists, setChecklists] = useState([]);
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [selectedAssignee, setSelectedAssignee] = useState('');
const [assignee,setAssignee] = useState([]);
const [Errors,setErrors] = useState({
    title:"",
    priority:"",
    checklists:"",
    checkliststitleerror:"",
});
const [localTaskDetails, setLocalTaskDetails] = useState({
    title: '',
    priority: '',
    assignee: '',
    checklists: [],
    dueDate: null,
});
const AddTaskModalContainerRef = useRef();
const dropdownref = useRef();
const today = new Date();

const fetchEmails = async () =>{
    try{
        const emails = await fetchAllUsers();
        if(emails?.data?.allEmails) 
        {
            const currentEmail = localStorage.getItem('email');
            const filteredEmails = emails.data.allEmails.filter(email => email !== currentEmail);
            setAllEmails(filteredEmails);
        }
    }
    catch(error){
        console.error("Error fetching users' emails:", error);
    }
};

const addChecklistItem =()=>{
    const newChecklist = { id: Date.now(), title: '', checked: false };
    setChecklists(prev => [...prev, newChecklist]);
    setLocalTaskDetails(prev => ({
        ...prev,
        checklists: [...prev.checklists, newChecklist]
    }));
};
const handleChecklistChange =(id,value)=>{
    setChecklists(prev=>{
        const updatedChecklists = prev.map(item=>(item.id === id ?{...item, title: value}:item));
        setLocalTaskDetails(prevTaskDetails=>({
            ...prevTaskDetails,
            checklists: updatedChecklists
        }));
        return updatedChecklists;
    });
};
const handleCheckboxChange =(id)=>{
    setChecklists(prev => {
        const updatedChecklists = prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item));
        setLocalTaskDetails(prevTaskDetails => ({
            ...prevTaskDetails,
            checklists: updatedChecklists
        }));
        return updatedChecklists;
    });
};
const deleteChecklistItem =(id)=>{
    setChecklists(prev=>{
        const updatedChecklists = prev.filter(item=>item.id !== id);
        setLocalTaskDetails(prevTaskDetails=>({
            ...prevTaskDetails,
            checklists: updatedChecklists
        }));
        return updatedChecklists;
    });
};
const handleDateChange =(date)=>{
    setSelectedDate(date);
    setLocalTaskDetails(prev=>({...prev, dueDate: date}));
};
const handlePrioritySelect =(priority)=>{
    setSelectedPriority(priority);
    setLocalTaskDetails(prev=>({...prev, priority}));
};
const handleTitleChange =(e)=>{
    setLocalTaskDetails(prev=>({...prev, title: e.target.value}));
};
const toggleDropdown =()=>{
    setIsDropdownOpen(!isDropdownOpen);
};
const handleAssigneeChange =(email)=>{
    setSelectedAssignee(email);
    setLocalTaskDetails(prev =>({...prev,assignee: email}));
    setIsDropdownOpen(false);
};

const handleSave =async(e)=>{
    e.preventDefault();
    setLoading(true);
    const email = localStorage.getItem('email')
    const token = localStorage.getItem('token')
    let errors = {};
    if(!localTaskDetails.title || localTaskDetails.title.trim() === ""){
        errors.title = "Title is Required"
    }
    if(!localTaskDetails.priority || localTaskDetails.priority.trim() === ""){
        errors.priority = "Priority is Required"
    }
    localTaskDetails.checklists.forEach((item)=>{
        if(!item.title || item.title.trim() === ""){
            errors.checkliststitleerror = "Title for all tasks in the tasklist are required"
        }
    })
    if(localTaskDetails.checklists.length < 1){
        errors.checklists = "At least one TaskList is Required"
    }
    setErrors(errors);
    if(Object.keys(errors).length > 0){
        setLoading(false);
        return;
    }
    if(localTaskDetails.title === "" || localTaskDetails.priority === "" || localTaskDetails.checklists === ""){
        setLoading(false);
        return;
    }
    
    try{
        if(editTaskId && editTask){
            if(localTaskDetails){
                let taskDetails = localTaskDetails;
                const response = await updateTask({taskDetails,email,editTaskId})
                if(response.status === 200){
                    handleRefresh();
                    resetEditTask();
                    closeAddTaskModal();
                }
            }
        }
        else{
            if(localTaskDetails){
                let taskDetails = localTaskDetails;
                const response = await postTask({taskDetails,email,token})
                if(response.status === 200){
                    handleRefresh();
                    resetEditTask();
                    closeAddTaskModal();
                }
            }
        }
    } 
    catch(error){
        console.log(error.message)
    }
    finally{
        setLoading(false);
    }
};
function checkClickOutside(e){
    if(displayAddTaskModal && AddTaskModalContainerRef.current && !AddTaskModalContainerRef.current.contains(e.target)){
        resetEditTask();
        closeAddTaskModal();
    }
}
function checkClickOutsidedropdown(e){
    if(isDropdownOpen && dropdownref.current && !dropdownref.current.contains(e.target)){
        setIsDropdownOpen(false);
        toggleDropdown();
    }
}
const fetchTaskData = async(id)=>{
    try{
        const response = await axios.get(`${BACKEND_URL}/task/edit/${id}`);
        const taskData = response.data;
        if(taskData){
            const updatedTaskState = {
                title: taskData.title || '',
                priority: taskData.priority || '',
                checklists: taskData.checklistarray || [],
                dueDate: taskData.dueDate || null,
            };
            setAssignee(taskData?.taskassigned);
            setLocalTaskDetails(updatedTaskState);
            setChecklists(taskData.checklistarray || []);
            setSelectedDate(taskData.dueDate ? new Date(taskData.dueDate) : null);
            setSelectedPriority(taskData.priority || '');
        }
    } 
    catch(error){
        console.error("Error fetching Task data:", error);
    }
};
useEffect(()=>{
    if(editTask && editTaskId){
        fetchTaskData(editTaskId);
    }
},[editTaskId, editTask]);

useEffect(()=>{
    fetchEmails();
},[assignee]);

useEffect(()=>{
    if(displayAddTaskModal){
        setLocalTaskDetails({
            title: '',
            priority: '',
            assignee: '',
            checklists: [],
            dueDate: null,
        });
        setSelectedDate(null);
        setSelectedPriority('');
        setChecklists([]);
    }
},[displayAddTaskModal]);

useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutside)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutside)
    }
},[displayAddTaskModal])

useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutsidedropdown)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutsidedropdown)
    }
},[isDropdownOpen])

  return(
    <div className={styles.AddTaskModalContainer} ref={AddTaskModalContainerRef}>
        <div className={styles.tasktitlediv}>
            <div className={styles.AddTaskTitlestar}><p className={styles.AddTaskTitle}>Title</p>&nbsp;<p className={styles.redstar}>*</p></div>
            <input type='text' placeholder='Enter Task Title' className={styles.AddTaskTitleInput} value={localTaskDetails.title} onChange={handleTitleChange}></input>
        </div>
        {Errors.title !== "" ? <p className={styles.TitleError}>{Errors.title}</p> : ""}
        <div className={styles.taskprioritydiv}>
            <div className={styles.AddTaskSelectPriority}>
                <p className={styles.AddTaskPriority}>Select Priority</p>&nbsp;
                <p className={styles.redstarPriority}>*</p>
            </div>
            <button className={selectedPriority === 'high' ? styles.AddTaskPriorityHighSelect : styles.AddTaskPriorityHigh} onClick={() => handlePrioritySelect('high')}><p className={styles.AddTaskPriorityHighdot}></p>&nbsp;&nbsp;HIGH PRIORITY</button>
            <button className={selectedPriority === 'moderate' ? styles.AddTaskPriorityModerateSelect : styles.AddTaskPriorityModerate} onClick={() => handlePrioritySelect('moderate')}><p className={styles.AddTaskPriorityModeratedot}></p>&nbsp;&nbsp;MODERATE PRIORITY</button>
            <button className={selectedPriority === 'low' ? styles.AddTaskPriorityLowSelect : styles.AddTaskPriorityLow} onClick={() => handlePrioritySelect('low')}><p className={styles.AddTaskPriorityLowdot}></p>&nbsp;&nbsp;LOW PRIORITY</button>
        </div>
        {Errors.priority !== "" ? <p className={styles.priorityError}>{Errors.priority}</p> : ""}
        <div className={styles.checklistitemsmaindiv}>
            <div className={styles.AddTaskAssigntoDiv}>
                <p className={styles.assigntotext}>Assign to</p>
                <div className={styles.customDropdown}>
                    <div className={selectedAssignee ? styles.selectedOptiondark : styles.selectedOption} onClick={toggleDropdown}>
                        {selectedAssignee || "Add an assignee"}
                    </div>
                    {isDropdownOpen && (
                    <div className={styles.dropdownOptions} ref={dropdownref}>
                        {allEmails.map(email => (
                        <div key={email} className={styles.dropdownOption}>
                            <span className={styles.circleIcon}>{email.slice(0, 2).toUpperCase()}</span>
                            <span className={styles.emailText}>{email}</span>
                            <button className={styles.assignButton} onClick={() => handleAssigneeChange(email)}>Assign</button>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>
            <div className={styles.taskchecklistdiv}>
                <p className={styles.AddTaskchecklisttext}>Checklist</p><p className={styles.AddTaskchecklistcount}>&nbsp;({checklists.filter(item=>item.checked).length}/{checklists.length})</p><p className={styles.redstar}>&nbsp;*</p>
            </div>
            <div className={styles.checklistitemsdiv}>
            {checklists.map(item=>(
                <div key={item.id} className={styles.checklistdiv}>
                    <div className={styles.checkboxContainer} onClick={()=>handleCheckboxChange(item.id)}>
                        <input
                            type="checkbox"
                            className={styles.checkboxchecklist}
                            checked={item.checked}
                            readOnly
                        />
                        <span className={styles.customCheckbox}>
                            {item.checked && <span className={styles.checkmark}></span>}
                        </span>
                    </div>
                    <input type='text' className={styles.inputchecklist} placeholder='Type..' value={item.title} onChange={(e)=>handleChecklistChange(item.id,e.target.value)}></input>
                    <img src={deletelist} onClick={()=>deleteChecklistItem(item.id)}></img>
                </div>))}
            </div>
            <div className={styles.Addnewchecklist}>
                <p className={styles.addsign} onClick={addChecklistItem}>+</p>
                <p className={styles.addnewtext} onClick={addChecklistItem}>&nbsp;Add New</p>
            </div>
        </div>
        {Errors.checkliststitleerror !== "" ? <p className={styles.checkliststitleerrorError}>{Errors.checkliststitleerror}</p> : ""}
        {Errors.checklists !== "" ? <p className={styles.checklistsError}>{Errors.checklists}</p> : ""}
        <div className={styles.taskbuttonsdiv}>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={today}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select Due Date"
                className={styles.AddTaskDueDateButton}
            />
            <button className={styles.AddTaskCancelButton} onClick={() => {closeAddTaskModal(); resetEditTask();}}>Cancel</button>
            <button disabled={loading} className={styles.AddTaskSaveButton} onClick={handleSave}>Save</button>
        </div>
    </div>
  )
}

export default AddTaskModal;