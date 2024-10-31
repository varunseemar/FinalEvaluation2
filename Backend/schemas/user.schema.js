const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:{
        type : String,
        require : true,
        trim: true,
    },
    email:{
        type : String,
        require : true,
        unique: true,
    },
    password:{
        type : String,
        require : true,
    },
    tasks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }]
},{timestamps: true})

module.exports = mongoose.model('User',userSchema);