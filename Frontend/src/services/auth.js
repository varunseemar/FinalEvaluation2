import React from 'react'
import axios from 'axios'
import {BACKEND_URL} from '../constants/constants.js'

export const register = async ({username,email,password})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/auth/Register`,{
            username,
            email,
            password
        },{
            headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const login = async ({email,password})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/auth/Login`,{
            email,
            password
        },{
            headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const updateUsername = async ({username,currentEmail,token})=>{
    try{
        const response = await axios.patch(`${BACKEND_URL}/auth/UpdateUsername`,{
            username,
            currentEmail
        },{
            headers : {
            'Authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const updateEmail = async ({email,currentEmail,token})=>{
    try{
        const response = await axios.patch(`${BACKEND_URL}/auth/UpdateEmail`,{
            email,
            currentEmail
        },{
            headers : {
            'Authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const updatePassword = async ({oldpassword,password,currentEmail,token})=>{
    try{
        const response = await axios.patch(`${BACKEND_URL}/auth/UpdatePassword`,{
            oldpassword,
            password,
            currentEmail
        },{
            headers : {
            'Authorization': token,
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const fetchAllUsers = async ()=>{
    try{
        const response = await axios.get(`${BACKEND_URL}/auth/AllUsers`,
            {
            headers : {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}