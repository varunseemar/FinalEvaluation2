import axios from 'axios'
import {BACKEND_URL} from '../constants/constants.js'

export const postTask = async ({taskDetails,email,token})=>{
    try{
        const response = await axios.post(`${BACKEND_URL}/task/Post`,{
            taskDetails,
            email,
        },
        {
            headers:{
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const fetchUserTasks = async ({email,boarddatefilter})=>{
    try{
        const response = await axios.get(`${BACKEND_URL}/task/usertasks`,{
            params: {email,boarddatefilter}
        });
        return response.data;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const fetchTaskById = async ({taskId})=>{
    try {
      const response = await axios.get(`${BACKEND_URL}/task/${taskId}`);
      return response.data;
    } 
    catch(error){
      throw new Error(error.response.data);
    }
};

export const updateTaskStatus = async ({taskId,newStatus}) => {
    try{
      const response = await axios.patch(`${BACKEND_URL}/task/updateStatus`,
        { 
            taskId, 
            newStatus 
        },
        {
            headers:{
            'Content-Type': 'application/json',
            },
        }
      );
      return response.data;
    }
    catch(err){
      throw new Error(err.response.data);
    }
};

export const deleteTask = async ({taskId}) => {
    try{
      const response = await axios.delete(`${BACKEND_URL}/task/Delete/${taskId}`);
      return response;
    }
    catch(err){
      throw new Error(err.response.data);
    }
};

export const updateTask = async ({taskDetails,email,editTaskId})=>{
    try{
        const response = await axios.put(`${BACKEND_URL}/task/edit/${editTaskId}`, {
            taskDetails,
            email,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const updateTaskBoard = async ({selectedAssignee,currentEmail})=>{
    try{
        const email = selectedAssignee;
        const response = await axios.put(`${BACKEND_URL}/task/editAll`, {
            currentEmail,
            email,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
    catch(err){
        throw new Error(err.response.data)
    }
}

export const updateChecklistItemStatus = async({taskId,checklistItemId,checked})=>{
    try{
      const response = await axios.patch(`${BACKEND_URL}/task/${taskId}/checklist/${checklistItemId}`,{checked});
      return response.status === 200;
    } 
    catch(error){
      console.error("Failed to update checklist item status:",error);
      return false;
    }
};