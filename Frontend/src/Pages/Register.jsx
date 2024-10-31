import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Register.module.css'
import front from '../images/front.png'
import back from '../images/back.png'
import user from '../images/user.png'
import email from '../images/email.png'
import pass from '../images/pass.png'
import passview from '../images/passview.png'
import passhide from '../images/passhide.png'
import {register} from '../services/auth.js'
import toast from 'react-hot-toast'

const Register = () => {
  const [displayRegisterPassword,setDisplayRegisterPassword] = useState(false);
  const [displayRegisterConfirmPassword,setDisplayRegisterConfirmPassword] = useState(false);
  const [refresh,setRefresh] = useState(0);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const [userData,setUserData] = useState({
      username: "",
      email: "",
      confirmpassword: "",
      password: "",
  })
  const [Errors,setErrors] = useState({
      username:"",
      email:"",
      confirmpassword:"",
      password:"",
      passwordnotsame:"",
      userExist:"",
  });
function toggleRegisterPassword(){
    setDisplayRegisterPassword(!displayRegisterPassword);
}
function toggleRegisterConfirmPassword(){
  setDisplayRegisterConfirmPassword(!displayRegisterConfirmPassword);
}
const handleChange = (e)=>{
  setUserData({
      ...userData,
      [e.target.name] : e.target.value
  })
}
const handleRefresh = ()=>{
    setRefresh(refresh + 1);
}

const handleSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true);
    let errors = {};
    if(!userData.username || userData.username.trim() === ""){
        errors.username = "Username is Required"
    }
    if(!userData.email || userData.email.trim() === ""){
      errors.email = "Email is Required"
    }
    if(!userData.confirmpassword || userData.confirmpassword.trim() === ""){
        errors.confirmpassword = "Confirm Password is Required"
    }
    if(!userData.password || userData.password.trim() === ""){
      errors.password = "Password is Required"
    }
    if(userData.confirmpassword !== userData.password){
      errors.passwordnotsame = "Confirm Password and Password are not same"
    }
    setErrors(errors);
    if(Object.keys(errors).length > 0){
        setLoading(false);
        return;
    }
    if(userData.username === "" || userData.email === "" || userData.confirmpassword === "" || userData.password === ""){
        setLoading(false);
        return;
    }
    try{
        const {username,email,password} = userData;
        const response = await register({username,email,password})
        console.log(response)
        if(response.status === 200){
            toast.success('Successfully Registered');
            navigate('/Login')
        }
    } 
    catch(error){
        if(error.message === "User already Registered"){
            errors.userExist = "Username Already Exist";
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
    <div className={styles.Registermain}>
      <div className={styles.Registerleft}>
        <div>
          <img className={styles.backimg} src={back}></img>
          <img className={styles.frontimg} src={front}></img>
        </div>
        <p className={styles.uppertxt}>Welcome aboard my friend</p>
        <p className={styles.lowertxt}>just a couple of clicks and we start</p>
      </div>
      <div className={styles.Registerright}>
        <p className={styles.Registertxt}>Register</p>
        <form className={styles.Regsiterform} onSubmit={handleSubmit}> 
          <span className={styles.spaninput}><img className={styles.RegisterUserImage} src={user}></img><input className={styles.Regsiterforminput} type='text' placeholder='Name' value={userData.username} name='username' onChange={handleChange}></input></span>
          {Errors.username !== "" ? <p className={styles.Error}>{Errors.username}</p> : ""}
          <span className={styles.spaninput}><img className={styles.RegisterEmailImage} src={email}></img><input className={styles.Regsiterforminput} type='email' placeholder='Email' value={userData.email} name='email' onChange={handleChange}></input></span>
          {Errors.email !== "" ? <p className={styles.Error}>{Errors.email}</p> : ""}
          <span className={styles.spaninput}><img className={styles.RegisterPassImage} src={pass}></img><input className={styles.Regsiterforminput} type={displayRegisterConfirmPassword ? 'text' : 'password'} placeholder='Confirm Password' value={userData.confirmpassword} name='confirmpassword' onChange={handleChange}></input><img className={styles.RegisterPassShowImage} src={displayRegisterConfirmPassword ? passhide : passview} onClick={toggleRegisterConfirmPassword}></img></span>
          {Errors.confirmpassword !== "" ? <p className={styles.Error}>{Errors.confirmpassword}</p> : ""}
          <span className={styles.spaninput}><img className={styles.RegisterPassImage} src={pass}></img><input className={styles.Regsiterforminput} type={displayRegisterPassword ? 'text' : 'password'} placeholder='Password' value={userData.password} name='password' onChange={handleChange}></input><img className={styles.RegisterPassShowImage} src={displayRegisterPassword ? passhide : passview} onClick={toggleRegisterPassword}></img></span>
          {Errors.password !== "" ? <p className={styles.Error}>{Errors.password}</p> : ""}
          {Errors.passwordnotsame !== "" && Errors.password === undefined && Errors.confirmpassword === undefined ? <p className={styles.Error}>{Errors.passwordnotsame}</p> : ""}
          {Errors.userExist !== "" ? <p className={styles.Error}>{Errors.userExist}</p> : ""}
          <button disabled={loading} className={styles.Registerbutton} type='submit'>Register</button>
        </form>
        <p className={styles.haveaccounttxt}>Have an account ?</p>
        <button className={styles.RegisterLogin} onClick={()=>navigate('/Login')}>Log in</button>
      </div>
    </div>
  )
}

export default Register;