import jwt from 'jsonwebtoken'
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const protectAdmin=catchAsync(async(req,res,next)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1]
    }
    if(!token){
        return next(
             new AppError("You are not logged in! Please login to access this.", 401)
        )
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.adminId=decoded.id;
    next();
})

export default protectAdmin;
