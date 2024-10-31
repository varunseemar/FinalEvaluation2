const mongoose = require('mongoose');

const checkListSchecma = new mongoose.Schema({
    checked:{
        type: Boolean,
        default: false,
    },
    id:{
        type: Number,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
});

const taskassignedSchecma = new mongoose.Schema({
    assignee:{
        type: String,
    },
});

const taskSchema = new mongoose.Schema(
  {
    title:{
        type: String,
        required: true,
    },
    priority:{
        type: String,
        enum: ['high', 'moderate', 'low'],
        required: true,
    },
    boardassigned:[{
        type: String,
    }],
    taskassigned:{
        type: [taskassignedSchecma],
    },
    checklistarray:{
        type: [checkListSchecma],
        validate:{
            validator: function(value){
                return value.length > 0;
            },
            message: 'At least one checklist item is required',
        },
        required: true,
    },
    status:{
        type: String,
        enum: ['backlog','inProgress','todo','done'],
        default: 'todo'
    },
    dueDate:{
        type: Date
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    creator:{
        type: String,
    },
  },
);

module.exports = mongoose.model('Task',taskSchema);