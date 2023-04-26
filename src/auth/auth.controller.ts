import { Request, Response } from "express";
import { User } from "../models/User.schema";

/**
 * @route POST api/auth/register
 * @desc Register user
 * @access Public
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
    
        const userExists = await User.findOne({ where: { email } });
    
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
    
        const user = await User.create({ email: email, username: username, password: password });
    
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @route POST api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const isMatch = await user.comparePassword(password);
    
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const token = user.generateJWT();
    
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};