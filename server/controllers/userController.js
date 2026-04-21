import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";
import protect from "../middlewares/authMiddleware.js";

const generateToKen = (userId) =>{
    const token = jwt.sign({userId} , process.env.JWT_SECRET,{expiresIn: "7d"});
    return token;
}

// controller for user registration
// POST : /api/users/register

export const registerUser = async (req, res) => {
    
    try {
        const { name, email, password } = req.body;

        //check if required fields are present
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        //check if user already exists
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // if user does not exist, create new user after hashing their password
        const hashedPassword = await bcrypt.hash( password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        })

        //send token in response (generate in seperate function)

        const token = generateToKen(newUser._id); // ._id property is auto generated my mongodb database
        newUser.password = undefined; // to hide password when new user is returned in response
        
        return res.status(201).json({message: "User registered successfully", token, user: newUser});

    } catch (error) {
        return res.status(400).json({ message: "Error registering user", error: error.message });
    }

}

// controller for user login
// POST : /api/users/login

export const loginUser = async (req, res) => {
    
    try {
        const { email, password } = req.body;

        //check if user exists
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // check if password is correct 
        if(!user.comparePassword(password)) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        //return success message with token

        const token = generateToKen(user._id); // ._id property is auto generated my mongodb database
        user.password = undefined; // to hide password when new user is returned in response
        
        return res.status(200).json({message: "User logged in successfully", token, user});
    } catch (error) {
        return res.status(400).json({ message: "Error logging in user", error: error.message });
    }

}

// controller for getting user by id
// GET : /api/users/data

export const getUserById = async (req, res) => {
    try {
        const userId = req.userId; // userId is not in req by default will add id in req using middleware         
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //return user
        user.password = undefined;
        return res.status(200).json({user});

    } catch (error) {
        return res.status(400).json({ message:error.message });
    }

}


// controller for user resumes
// GET : /api/users/resumes

export const getUserResumes = async (req, res) => {
    try {

        const userId = req.userId;
        const resumes = await Resume.find({userId});
        return res.status(200).json({resumes});

    } catch (error) {
        return res.status(400).json({ message:error.message });
    }
}
