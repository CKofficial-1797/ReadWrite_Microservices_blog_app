import { Request, Response } from "express";
import User from "../model/User.js";
import  jwt from "jsonwebtoken";
import TryCatch from "../utils/TryCatch.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import { v2 as cloudinary } from "cloudinary";
import getBuffer from "../utils/datauri.js";
import { oauth2Client } from "../utils/GoogleConfig.js";

import axios from "axios";
export const loginUser = async(req: Request,res: Response) => {
    try {
        const {code} = req.body;
        if(!code){
            res.status(400).json({
                message: "Please provide code",
            });
            return;
        }
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
        //////
        const { email, name, picture } = userRes.data as { email: string; name: string; picture: string };
        /////
        let user = await User.findOne({email});
        if(!user){
            user = await User.create({
                email,
                name,
                image: picture
            });
        }
        const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
            expiresIn: "30d"
        });
                
                res.status(200).json({
                    message: "Login successful",
                    user,
                    token
                })
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
//to get current user
export const myProfile = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user =req.user;
    res.json(user);

})

// to get any user 
export const getUserProfile = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const userId = req.params.id;
    const user = await User.findById(userId);
    if(!user){
        res.status(404).json({
            message: "User not found",
        });
        return;
    }
    res.json(user);
});



  export const updateUser = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { name, instagram, facebook, linkedin, bio } = req.body;
  
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        name,
        instagram,
        facebook,
        linkedin,
        bio,
      },
      { new: true }
    );
  
    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: "5d",
    });
  
    res.json({
      message: "User Updated",
      token,
      user,
    });
  });

  export const updateProfilePic = TryCatch(async (req: AuthenticatedRequest, res) => {
    const file =req.file;
    if(!file){
        res.status(400).json({
            message: "Please upload a file",
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if(!fileBuffer|| !fileBuffer.content){
        res.status(400).json({
            message: "Failed to generate buffer",
        });
        return;
    }

    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs",
    });
    const user = await User.findByIdAndUpdate(req.user?._id, {
        image: cloud.secure_url,
    }, {
        new: true,
    });
    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
        expiresIn: "5d",
      });
    
      res.json({
        message: "User Profile picture is  Updated",
        token,
        user,
      });
    });
  