const express = require('express')
const User = require('../schemas/user.schema')
const bcrypt = require('bcrypt')
const router = express.Router();
const jwt = require('jsonwebtoken')
const authUserLogin = require('../middlewares/authLogin')

router.post('/Register', async (req,res)=>{
    try{
        const {username,email,password} = req.body;
        const userExsist = await User.findOne({email})
        console.log(userExsist)
        if(userExsist){
            return res.status(400).send("User already Registered")
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        const user = new User({
            username,
            email,
            password : hashPassword,
        });
        await user.save();
        const token = jwt.sign({_id:user.id},process.env.JWTOKEN)
        res.json({
            username,
            email,
            token,
        })
    }
    catch(err){
        throw new Error(err.message);
    }
})

router.post('/Login', async (req,res)=>{
    try{
        const {email,password} = req.body;
        const userExsist = await User.findOne({email})
        console.log(userExsist)
        if(!userExsist){
            return res.status(400).send("Wrong email or Password");
        }
        const validPassword = bcrypt.compareSync(password,userExsist.password);
        if(!validPassword){
            return res.status(400).send("Wrong email or Password");
        }
        const token = jwt.sign({_id : userExsist._id},process.env.JWTOKEN);
        res.json({
            email:userExsist.email,
            username:userExsist.username,
            token,
        })
    }
    catch(err){
        throw new Error(err.message);
    }
})

router.patch('/UpdateUsername',authUserLogin, async (req,res)=>{
    try{
        const {username,currentEmail} = req.body;
        const userExsist = await User.findOne({email:currentEmail})
        console.log(userExsist)
        if(!userExsist){
            return res.status(400).send("User Doesn't Exist");
        }
        const updatedUser = await User.findOneAndUpdate(
            {email: currentEmail},
            {username},
            {new: true}
        );
        if(!updatedUser){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Username updated successfully', username: updatedUser.username });
    }
    catch(err){
        throw new Error(err.message);
    }
})

router.patch('/UpdateEmail',authUserLogin, async (req,res)=>{
    try{
        const {email,currentEmail} = req.body;
        const userExsist = await User.findOne({email:currentEmail})
        console.log(userExsist)
        if(!userExsist){
            return res.status(400).send("User Doesn't Exist");
        }
        const updatedUser = await User.findOneAndUpdate(
            {email: currentEmail},
            {email},
            {new: true}
        );
        if(!updatedUser){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Email updated successfully', email: updatedUser.email });
    }
    catch(err){
        throw new Error(err.message);
    }
})

router.patch('/UpdatePassword',authUserLogin, async (req,res)=>{
    try{
        const {oldpassword,password,currentEmail} = req.body;
        const userExsist = await User.findOne({email:currentEmail})
        console.log(userExsist)
        if(!userExsist){
            return res.status(400).send("User Doesn't Exist");
        }
        const validPassword = bcrypt.compareSync(oldpassword,userExsist.password);
        if(!validPassword){
            return res.status(400).send("Wrong Old Password");
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        const updatedUser = await User.findOneAndUpdate(
            {email: currentEmail},
            {password: hashPassword},
            {new: true}
        );
        if(!updatedUser){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Password updated successfully'});
    }
    catch(err){
        throw new Error(err.message);
    }
})

router.get('/AllUsers', async (req,res)=>{
    try{
        const users = await User.find().select('email');
        if(!users || users.length === 0){
            return res.status(404).json({ message: 'Users not found' });
        }
        const emails = users.map(user => user.email);
        res.status(200).json({ message: 'All Users Fetched successfully' , allEmails: emails});
    }
    catch(err){
        throw new Error(err.message);
    }
})

module.exports = router;