import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Login.module.css'
import front from '../images/front.png'
import back from '../images/back.png'
import email from '../images/email.png'
import pass from '../images/pass.png'
import passview from '../images/passview.png'
import passhide from '../images/passhide.png'
import {login} from '../services/auth.js'
import toast from 'react-hot-toast'

const Login = () => {
  const [displayLoginPassword,setDisplayLoginPassword] = useState(false);
  const [refresh,setRefresh] = useState(0);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();
  const [userData,setUserData] = useState({
      email: "",
      password: "",
  })
  const [Errors,setErrors] = useState({
      email:"",
      password:"",
      wrongEmailpass:"",
  });
  function toggleLoginPassword(){
      setDisplayLoginPassword(!displayLoginPassword);
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
    if(!userData.email || userData.email.trim() === ""){
        errors.email = "Email is Required"
    }
    if(!userData.password || userData.password.trim() === ""){
        errors.password = "Password is Required"
    }
    setErrors(errors);
    if(Object.keys(errors).length > 0){
        setLoading(false);
        return;
    }
    if(userData.email === "" || userData.password === ""){
        setLoading(false);
        return;
    }
    try{
        const {email,password} = userData;
        const response = await login({email,password})
        console.log(response)
        if(response.status === 200){
            toast.success('Successfully Logged In');
            const {data} = response;
            localStorage.setItem('email', email)
            localStorage.setItem('username', data.username)
            localStorage.setItem('token', data.token)
            navigate('/');
        }
    } 
    catch(error){
        if(error.message === "Wrong email or Password"){
            errors.wrongEmailpass = "Wrong Email or Password";
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
    <div className={styles.Loginmain}>
      <div className={styles.Loginleft}>
        <div>
          <img className={styles.backimg} src={back}></img>
          <img className={styles.frontimg} src={front}></img>
        </div>
        <p className={styles.uppertxt}>Welcome aboard my friend</p>
        <p className={styles.lowertxt}>just a couple of clicks and we start</p>
      </div>
      <div className={styles.Loginright}>
        <p className={styles.Logintxt}>Login</p>
        <form className={styles.Loginform} onSubmit={handleSubmit}>
          <span className={styles.spaninput}><img className={styles.LoginEmailImage} src={email}></img><input className={styles.Loginforminput} type='email' placeholder='Email' value={userData.name} name='email' onChange={handleChange}></input></span>
          {Errors.email !== "" ? <p className={styles.LoginError}>{Errors.email}</p> : ""}
          <span className={styles.spaninput}><img className={styles.LoginPassImage} src={pass}></img><input className={styles.Loginforminput} type={displayLoginPassword ? 'text' : 'password'} placeholder='Password' value={userData.name} name='password' onChange={handleChange}></input><img className={styles.LoginPassShowImage} onClick={toggleLoginPassword} src={displayLoginPassword ? passhide : passview}></img></span>
          {Errors.password !== "" ? <p className={styles.LoginError}>{Errors.password}</p> : ""}
          {Errors.wrongEmailpass !== "" ? <p className={styles.LoginError}>{Errors.wrongEmailpass}</p> : ""}
          <button disabled={loading} className={styles.Loginbutton} type='submit'>Login</button>
        </form>
        <p className={styles.haveaccounttxt}>Have no account ?</p>
        <button className={styles.LoginRegister} onClick={()=>navigate('/Register')}>Register</button>
      </div>
    </div>
  )
}

export default Login;