import React from 'react'
import {useEffect,useRef,useState} from 'react'
import styles from '../styles/AddPeopleModal.module.css'
import { fetchAllUsers } from '../services/auth'
import { updateTaskBoard } from '../services/task'

const AddPeopleModal = ({openPeopleAddedModal,setAddedToBoard,closeAddPeopleModal,displayAddPeopleModal}) => {
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [selectedAssignee, setSelectedAssignee] = useState('');
const [allEmails, setAllEmails] = useState([]);
const [loading,setLoading] = useState(false);
const AddPeopleModalContainerRef = useRef();
const dropdownrefboard = useRef();
const [Errors,setErrors] = useState({
    email:"",
});

function checkClickOutside(e){
    if(displayAddPeopleModal && AddPeopleModalContainerRef.current && !AddPeopleModalContainerRef.current.contains(e.target)){
        closeAddPeopleModal();
    }
}
const handleAssigneeChange =(email)=>{
    setSelectedAssignee(email);
    setIsDropdownOpen(false);
};
const toggleDropdown =()=>{
    setIsDropdownOpen(!isDropdownOpen);
};
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
const handlesubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    const currentEmail = localStorage.getItem('email');
    let errors = {};
    if(!selectedAssignee || selectedAssignee.trim() === ""){
        errors.email = "Email is Required"
    }
    setErrors(errors);
    if(Object.keys(errors).length > 0){
        setLoading(false);
        return;
    }
    if(!selectedAssignee){
        setLoading(false);
        return;
    }
    try{
        if(selectedAssignee){
            const response = await updateTaskBoard({selectedAssignee,currentEmail})
            if(response.status === 200){
                setAddedToBoard(selectedAssignee);
                closeAddPeopleModal();
                openPeopleAddedModal();
            }
        }
    }
    catch(error){
        console.log(error.message)
    }
    finally{
        setLoading(false);
    }
}
function checkClickOutsidedropdownboard(e){
    if(isDropdownOpen && dropdownrefboard.current && !dropdownrefboard.current.contains(e.target)){
        setIsDropdownOpen(false);
    }
}
useEffect(()=>{
    fetchEmails();
},[]);

useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutside)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutside)
    }
},[displayAddPeopleModal])

useEffect(()=>{
    document.addEventListener('mousedown',checkClickOutsidedropdownboard)
    return()=>{
        document.removeEventListener('mousedown',checkClickOutsidedropdownboard)
    }
},[isDropdownOpen])

  return (
    <div className={styles.AddPeopleModalContainer} ref={AddPeopleModalContainerRef}>
        <p className={styles.AddPeopletxt}>Add people to the board</p>
        <div className={styles.addtoboarddiv}>
            <div className={selectedAssignee ? styles.selectedOptiondarkboard : styles.selectedOptionboard} onClick={toggleDropdown}>
                {selectedAssignee || "Enter the email"}
            </div>
            {isDropdownOpen && (
                <div className={styles.dropdownOptionsboard} ref={dropdownrefboard}>
                    {allEmails.map(email => (
                    <div key={email} className={styles.dropdownOptionboard}>
                        <span className={styles.circleIconboard}>{email.slice(0, 2).toUpperCase()}</span>
                        <span className={styles.emailTextboard}>{email}</span>
                        <button className={styles.assignButtonboard} onClick={() => handleAssigneeChange(email)}>Assign</button>
                    </div>
                    ))}
                </div>
            )}
        </div>
        {Errors.email !== "" ? <p className={styles.addtoboardemailError}>{Errors.email}</p> : ""}
        <div className={styles.AddGroupButtonDiv}>
            <button className={styles.AddPeoplecancelbutton} onClick={closeAddPeopleModal}>Cancel</button>
            <button disabled={loading} className={styles.AddPeoplebutton} onClick={handlesubmit}>Add Email</button>
        </div>
    </div>
  )
}

export default AddPeopleModal;