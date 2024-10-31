const express = require('express')
const User = require('../schemas/user.schema')
const TaskSchema = require('../schemas/task.schema')
const router = express.Router();
const authUserLogin = require('../middlewares/authLogin')
const moment = require('moment');

router.post('/Post',authUserLogin, async(req,res)=>{
    try{
        const {taskDetails, email} = req.body;
        const title = taskDetails.title;
        const priority = taskDetails.priority;
        const checklistarray = taskDetails.checklists;
        const dueDate = taskDetails?.dueDate || null;
        const taskAssigned = Array.isArray(taskDetails.assignee) ? taskDetails.assignee : [taskDetails.assignee];
        if(!title || !priority || !checklistarray || checklistarray.length === 0){
            return res.status(400).json("Please provide all the required fields");
        }
        const taskData ={
            title,
            priority,
            checklistarray,
            dueDate,
            taskassigned: taskAssigned.map(assignee =>({assignee})),
            createdAt: new Date(),
            creator: email,
        };
        const task = new TaskSchema(taskData);
        await task.save();
        res.status(200).send("Task Created Successfully");
    } 
    catch(error){
        throw new Error(error.message)
    }
});

router.get('/usertasks', async(req,res)=>{
    try{
        const {email,boarddatefilter} = req.query;
        if(boarddatefilter === 'null'){
            const tasks = await TaskSchema.find({
                $or:[
                {creator: email},
                {'taskassigned.assignee': email}
            ]});
            if(!tasks.length){
                return res.status(404).json({message: "No tasks found for this creator"});
            }
            res.status(200).json(tasks);
        }
        else{
            let endDate;
            if(boarddatefilter === 'day')
            {
                endDate = moment().endOf('day').toDate();
            } 
            else if(boarddatefilter === 'week')
            {
                endDate = moment().endOf('week').toDate();
            } 
            else if(boarddatefilter === 'month')
            {
                endDate = moment().endOf('month').toDate();
            }
            let query ={
                $and:[
                    {$or:[
                        {creator: email},
                        {'taskassigned.assignee': email}
                    ]},
                    {$or:[
                        {dueDate: {$lte: endDate}},
                        {dueDate: null}
                    ]}
                ]
            };
            const tasks = await TaskSchema.find(query);
            if(!tasks.length)
                {
                    return res.status(404).json({message: "No tasks found for this creator"});
                }
                res.status(200).json(tasks);
            }
    }
    catch(error)
    {
        throw new Error(error.message)
    }
});

router.patch('/updateStatus', async(req,res)=>{
    try{
        const {taskId,newStatus} = req.body;
        const validStatuses = ['backlog', 'inProgress', 'todo', 'done'];
        if(!validStatuses.includes(newStatus)){
            return res.status(400).json({message: 'Invalid status value'});
        }
        const updatedTask = await TaskSchema.findByIdAndUpdate(
            taskId,
            {status: newStatus},
            {new: true}
        );
        if(!updatedTask){
            return res.status(404).json({message: 'Task not found'});
        }
        res.status(200).json({message: 'Task status updated successfully'});
    }
    catch(error){
        throw new Error(error.message)
    }
});

router.get('/:taskId', async(req,res)=>{
    try{
        const {taskId} = req.params;
        const task = await TaskSchema.findById(taskId);
        if(!task){
            return res.status(404).json({message: "Task Not Found"});
        }
        res.status(200).json(task);
    }
    catch(error){
        throw new Error(error.message)
    }
});

router.delete('/Delete/:taskId', async(req,res)=>{
    try{
        const {taskId} = req.params;
        const task = await TaskSchema.findByIdAndDelete(taskId);
        if(!task){
            return res.status(404).json({message: "Task Not Found"});
        }
        res.status(200).send("Task deleted Successfully");
    }
    catch(error){
        throw new Error(error.message)
    }
});

router.put('/edit/:taskId', async(req, res) => {
    try{
        const {taskId} = req.params;
        const {taskDetails, email} = req.body;
        const title = taskDetails.title;
        const priority = taskDetails.priority;
        const checklistarray = taskDetails.checklists;
        const dueDate = taskDetails?.dueDate || null;
        const taskAssigned = Array.isArray(taskDetails.assignee) ? taskDetails.assignee : [taskDetails.assignee];
        if(!title || !priority || !checklistarray || checklistarray.length === 0){
            return res.status(400).json("Please provide all the required fields");
        }
        const existingTask = await TaskSchema.findById(taskId);
        if(!existingTask){
            return res.status(404).json({message: "Task not found"});
        }
        const taskData ={
            title,
            priority,
            checklistarray,
            dueDate,
            createdAt: new Date(),
            creator: email,
        };
        const existingAssignees = existingTask.taskassigned.map(item => item.assignee);
        const newAssignees = taskAssigned.filter(assignee => !existingAssignees.includes(assignee) && assignee !== email);
        existingTask.taskassigned.push(...newAssignees.map(assignee => ({assignee})));
        Object.assign(existingTask,taskData);
        await existingTask.save();
        res.status(200).send("Task Updated Successfully");
    } 
    catch(error){
        throw new Error(error.message)
    }
});

router.put('/editAll', async(req, res) => {
    try{
        const { currentEmail, email } = req.body;
        const tasks = await TaskSchema.find({ creator: currentEmail });
        if(tasks.length === 0){
            return res.status(404).json({ message: "No tasks found for this user" });
        }
        const tasksToUpdate = tasks.filter(task => 
            !task.taskassigned.some(assignee => assignee.assignee === email)
        );
        tasksToUpdate.forEach(async(task)=>{
            task.taskassigned.push({assignee: email});
            await task.save();
        });
        if(tasksToUpdate.length > 0){
            res.status(200).json({message: "Task(s) updated successfully",updatedCount: tasksToUpdate.length});
        } 
        else{
            res.status(200).json({message: "No new assignee added, email already assigned to all tasks"});
        }
    } 
    catch(error){
        throw new Error(error.message)
    }
});


router.get('/edit/:taskId', async(req,res)=>{
    try{
        const {taskId} = req.params;
        const task = await TaskSchema.findById(taskId);
        if(!task){
            return res.status(404).json({message: "No task found for this Id"});
        }
        res.status(200).json(task);
    } 
    catch(error){
        throw new Error(error.message)
    }
});

router.patch('/:taskId/checklist/:checklistItemId',async(req, res)=>{
    const {taskId,checklistItemId} = req.params;
    const {checked} = req.body;
    try{
      const task = await TaskSchema.findById(taskId);
      if (!task) return res.status(404).json({message: "Task not found"});
      const checklistItem = task.checklistarray.id(checklistItemId);
      if (!checklistItem) return res.status(404).json({message: "Checklist item not found"});
      checklistItem.checked = checked;
      await task.save();
      res.status(200).json({message: "Checklist item status updated"});
    } 
    catch(error){
      console.error("Error updating checklist item:", error);
      res.status(500).json({message: "Failed to update checklist item status"});
    }
});

module.exports = router;