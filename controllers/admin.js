const Admin = require("../models/admin");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Response = {parse : (err,msg)=>{return {err,msg}}}
exports.register = async (req, res) => {
    let phoneNumber = req.phoneNumber, userType = req.userType;

    if (req.body.phoneNumber == undefined) {
        return res.json(Response.parse(false, 'phoneNumber is missing'));
    }
    if (req.body.password == undefined) {
        return res.json(Response.parse(false, 'password is missing'));
    }
    if (req.body.name == undefined) {
        return res.json(Response.parse(false, 'name is missing'));
    }
    if (req.body.userType == undefined) {
        return res.json(Response.parse(false, 'userType is missing'));
    }

    try {
        let data = {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            userType: req.body.userType,
            password: bcrypt.hashSync(req.body.password, 8),
        }

        if (req.body.city) data.city = req.body.city;
        if (req.body.state) data.state = req.body.state;
        if (req.body.emailId) {
            data.emailId = req.body.emailId
        }
        let {token, expiredTime} = await Admin.generateAuthToken(req.body.phoneNumber);
        let record = new Admin(data);
        let savedData = await record.save();
        res.json(Response.parse(false, { token, expiredTime, role: savedData.userType }))
    } catch (error) {
        console.log(error);
        res.json(Response.parse(true, "Something went wrong"));
    }

}

exports.login = async (req, res) => {
    if (req.body.phoneNumber == undefined) {
        return res.json(Response.parse(false, 'phoneNumber is missing'));
    }
    if (req.body.password == undefined) {
        return res.json(Response.parse(false, 'password is missing'));
    }

    let adminData = await Admin.findOne({ phoneNumber: req.body.phoneNumber,isActive:true });
    
    if (adminData) {
        let isMatched = bcrypt.compareSync(req.body.password, adminData.password);
        if (isMatched) {
            let {token, expiredTime} = await Admin.generateAuthToken(req.body.phoneNumber);
            res.json(Response.parse(false, {userId: adminData._id, token, expiredTime, name: adminData.name, role: adminData.userType, phoneNumber: adminData.phoneNumber}))
        } else {
            res.json(Response.parse(false, 'Invalid credentials'))
        }
    } else {
        res.json(Response.parse(false, 'Invalid credentials'));
    }
}

exports.refreshToken = async (req, res) => {
    try{
        let user = await Admin.findOne({_id:req.userId, isActive:true})
        if(user){
            let {token, expiredTime} = await Admin.generateAuthToken(req.phoneNumber);
            return res.json(Response.parse(false, { refreshToken:token, expiredTime, role: req.userType }))
        }

        return res.status(403).json(Response.parse("Invalid Token"))
    }catch(er){
        console.log(er)
    }
}