import React, { useEffect } from 'react'
import { useState } from 'react'
import styles from '../styles/Settings.module.css'
import user from '../images/user.png'
import email from '../images/email.png'
import pass from '../images/pass.png'
import passview from '../images/passview.png'
import passhide from '../images/passhide.png'
import {updateUsername , updateEmail, updatePassword} from '../services/auth.js'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Settings = () => {
  const [displaySettingsPassword,setDisplaySettingsPassword] = useState(false);
  const [displaySettingsoldpassword,setDisplaySettingsoldpassword] = useState(false);
  const [refresh,setRefresh] = useState(0);
  const [loading,setLoading] = useState(false);
  const [userData,setUserData] = useState({
      username: "",
      email: "",
      oldpassword: "",
      password: "",
  })
  const [Errors,setErrors] = useState({
      noSelection:"",
      oldpassword:"",
      onlyOneSelection:""
  });
  const navigate = useNavigate();
  useEffect(()=>{
    let storedEmail = localStorage.getItem('email');
    let storedUsername = localStorage.getItem('username');
    setUserData((prevData)=>({
      ...prevData,
      email: storedEmail || "",
      username: storedUsername || ""
    }));
  },[])
  function toggleSettingsPassword(){
    setDisplaySettingsPassword(!displaySettingsPassword);
  }
  function toggleSettingsoldpassword(){
    setDisplaySettingsoldpassword(!displaySettingsoldpassword);
  }
  const handleRefresh = ()=>{
    setRefresh(refresh + 1);
  }
  const handleChange = (e)=>{
    setUserData({
        ...userData,
        [e.target.name] : e.target.value
    })
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true);
    let errors = {};
    const filledFields =[
      userData.username ? 'username' : null,
      userData.email ? 'email' : null,
      (userData.oldpassword || userData.password) ? 'password' : null
    ].filter(Boolean);
    if(filledFields.length === 0){
      errors.noSelection = "Please enter a value to update";
      setErrors(errors);
      setLoading(false);
      return;
    }
    if(filledFields.length > 1){
      errors.onlyOneSelection = "Only one value can be updated at a time";
      setErrors(errors);
      setLoading(false);
      return;
    }
    setErrors(errors);
    if(Object.keys(errors).length > 0){
        setLoading(false);
        return;
    }
    try{
      let currentEmail = localStorage.getItem('email');
      let token = localStorage.getItem('token');
      if(userData.username){
        const {username} = userData;
        const response = await updateUsername({username,currentEmail,token});
        if(response.status === 200){
          toast.success('Successfully Updated');
          localStorage.setItem('username',response.data.username);
        }
      }
      else if(userData.email){
        const {email} = userData;
        const response = await updateEmail({email,currentEmail,token});
        if(response.status === 200){
          toast.success('Successfully Updated');
          localStorage.setItem('email',response.data.email);
        }
      }
      else if(userData.oldpassword && userData.password){
        const {oldpassword, password} = userData;
        const response = await updatePassword({oldpassword,password,currentEmail,token});
        if(response.status === 200){
          toast.success('Successfully Updated');
          setTimeout(()=>{
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            navigate('/Login');
            toast.success('Login Again With New Password');
          },1000)
        }
      }
      setUserData({
        username: "",
        email: "",
        oldpassword: "",
        password: "",
      });
    } 
    catch(error){
        if(error.message === "Wrong Old Password"){
            errors.oldpassword = "Wrong Old Password";
            setErrors(errors);
        }
        handleRefresh();
        if(Object.keys(errors).length > 0){
            return;
        }
        console.log(error.message)
    }
    finally{
        setLoading(false);
    }
  }

  return (
    <div>
      <div className={styles.upperSettings}>
        <p>Settings</p>
      </div>
      <div className={styles.lowerSettings}>
        <form className={styles.Settingsform} onSubmit={handleSubmit}>
          <span className={styles.settingsspaninput}><img className={styles.SettingsUserImage} src={user}></img><input className={styles.Settingsforminput} type='text' placeholder='Name' value={userData.username} name='username' onChange={handleChange}></input></span>
          <span className={styles.settingsspaninput}><img className={styles.SettingsEmailImage} src={email}></img><input className={styles.Settingsforminput} type='email' placeholder='Update Email' value={userData.email} name='email' onChange={handleChange}></input></span>
          <span className={styles.settingsspaninput}><img className={styles.SettingsPassImage} src={pass}></img><input className={styles.Settingsforminput} type={displaySettingsoldpassword ? 'text' : 'password'} placeholder='Old Password' value={userData.oldpassword} name='oldpassword' onChange={handleChange}></input><img className={styles.SettingsPassShowImage} src={displaySettingsoldpassword ? passhide : passview} onClick={toggleSettingsoldpassword}></img></span>
          <span className={styles.settingsspaninput}><img className={styles.SettingsPassImage} src={pass}></img><input className={styles.Settingsforminput} type={displaySettingsPassword ? 'text' : 'password'} placeholder='New Password' value={userData.password} name='password' onChange={handleChange}></input><img className={styles.SettingsPassShowImage} src={displaySettingsPassword ? passhide : passview} onClick={toggleSettingsPassword}></img></span>
          {Errors.noSelection !== "" ? <p className={styles.UpdateError}>{Errors.noSelection}</p> : ""}
          {Errors.onlyOneSelection !== "" ? <p className={styles.UpdateError}>{Errors.onlyOneSelection}</p> : ""}
          {Errors.oldpassword !== "" ? <p className={styles.UpdateError}>{Errors.oldpassword}</p> : ""}
          <button disabled={loading} className={styles.Settingsbutton} type='submit'>Update</button>
        </form>
      </div>
    </div>
  )
}

export default Settings