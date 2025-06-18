const User = require('../models/auth-model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Registration form here

const register = async(req,res)=>{
    try {
        const{username,email,phone,password,isAdmin}=req.body
        // Check if email or unique_name already exists
        const existingUser = await User.findOne({$or: [{ email }, { phone }]});
        
        if (existingUser) {
            return res.status(400).json({
            msg: "Email or unique name already exists"
            });
        }
        //password encryption here 
        const salt_round = 10;
        const hash_password = await bcrypt.hash(password,salt_round);

        const userCreat = await User.create({username,email,phone,password:hash_password,isAdmin})

        return res.status(200).json({msg:userCreat})
    } catch (error) {
        res.status(401).json({msg:"user not created"})
    }
    
}

//login form here
const login = async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(401).json({msg:"user not exist"})
        }
        if(user && await bcrypt.compare(password,user.password))
        {
            const token = jwt.sign(
                { id: user._id,
                  username: user.username,
                  email: user.email
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "30d" }
              );
            return res.status(200).json({user:
                {
                id:user._id,
                name:user.name,
                email:user.email
                },
                token
            })
        }
        else{
            res.status(400).json("invalid password")
        }
    } catch (error) {
        console.log("error at login time", error);
    }
}

//get single user function here
const getUser = async(req,res)=>{

    try {
        const getAllData = req.user;
        res.status(200).json({data:getAllData})
    } catch (error) {
       console.log("error getting when fetch all user data",error) 
    }

}

//get all users
const getAllusers = async(req,res)=>{
    try {
        const get = await User.find();
        if(!User){
            return res.status(404).json({message:"user not available"})
        }
            res.status(200).json(get) 
    } catch (error) {
       console.log("error from get user") 
    }
    
}
module.exports={register,login,getUser,getAllusers}