const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports.signin = async function (req, res) {
    // console.log(req.body);
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (!existingUser) {
            return res.status(200).json({ message: "User does not exist" });
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(200).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'chat', { expiresIn: "8d" });
        return res.status(200).json({ result: existingUser, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
module.exports.signup = async function (req, res) {
    console.log(req.body);
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        console.log(existingUser);
        if (existingUser) return res.status(200).json({ message: "User already exists" });
     
        if (req.body.password != req.body.confirmPassword) {
            return res.status(200).json({ message: "Passwords don't match" });
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const result = await User.create({ email: req.body.email, password: hashedPassword, name: req.body.name});


        const token = jwt.sign({ email: result.email, id: result._id, isStudent: result.isStudent }, 'chat', { expiresIn: "8d" });
        // console.log(result);
        return res.status(200).json({ result, token });
    } catch (err) {
        console.log(err);
    }
}
module.exports.getUsers=async function(req,res){
    try{
        let keyword=req.params.keyword;
        console.log(keyword);
        const users=await User.find({name:{$regex: keyword,$options:'i'}});
        const users2=await User.find({email:{$regex: keyword,$options:'i'}});
        let unique=new Map();
        let id=new Map();
        console.log(req.userId,'hiiiiiiii');
        for(let i=0;i<users.length;i++){
            let str=users[i]._id.toString();
            console.log(str);
            if(str===req.userId){

            }else if(id.has(str)){

            }else{
                id.set(str,1);
                unique.set(users[i],1);
            }
        }
        for(let i=0;i<users2.length;i++){
            let str=users2[i]._id.toString();
            console.log(str);
            if(str===req.userId){

            }else if(id.has(str)){

            }else{
                id.set(str,1);
                unique.set(users2[i],1);
            }
        }
        console.log(id);
        var union = [];
        for (let key of unique.keys()) {
            union.push(key);
        }
        // console.log(union);
        return res.status(200).json({data:union});
    }catch(err){
        console.log(err);
    }
}
