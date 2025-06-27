const User  = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../model/user');


const register = async (req, res)=>{
    try{
        const {username, password, role} = req.body;

        let user = await User.findOne({username});
        if(user){
            return res.status(401).json({
                message: "username already taken"
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hash,
            role
        });
        await newUser.save();
        res.status(201).json({
            message: "you registered successfully✅",
            data: newUser
        })
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "something went wrong❌"
        })
    }
}


const login = async(req, res)=>{
    try{
        const {username, password} = req.body;
        let userCheck = await User.findOne({username});
        if(!userCheck){
            return res.status(401).json({
                message: "no user with this name❌"
            })
        }

        const passwordCheck = bcrypt.compareSync(password, userCheck.password);
        if(!passwordCheck){
            return res.status(401).json({
                message: "incorrect password❌"
            })
        }

        const token = jwt.sign({
            id: userCheck._id,
            username: userCheck.username,
            role: userCheck.role
        }, process.env.PRIVATE_KEY,
        {expiresIn: '10m'});

        res.status(201).json({
            message: "you're logged in ✅",
            token
        });
    }catch(err){
       console.error(err);
        res.status(500).json({
            message: "something went wrong❌"
        }) 
    }
}

const changePassword = async (req, res)=>{
    try{
        const {oldPassword, newPassword} = req.body;
        const user = await User.findById(req.userInfo.id);
    
        let isPasswordMatching = bcrypt.compareSync(oldPassword, user.password);
        if(!isPasswordMatching){
            return res.status(400).json({
                message: "the password doesn't match with the user's"
            })
        }

        const salt = bcrypt.genSalt(10);
        const hash = bcrypt.hash(newPassword, salt);

        user.password = hash;
        await user.save();
    }catch(err){
        console.error(err);
        res.status(500).json({message: "something went wrong"});
    }
}

module.exports = {
    register, 
    login,
    changePassword
};
