import { Request, Response } from "express";
import { RequestWithUser } from "../models/request.interface";
import { User, UserInstance } from "../models/User.schema";
import { sendMail } from "../utils/send-mail";
import { Token, TokenInstance } from "../models/Token.schema";

/**
 * @route POST api/auth/register
 * @desc Register user
 * @access Public
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;
    
        const userExists: UserInstance = await User.findOne({ where: { email } });
    
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
    
        const user: UserInstance = await User.create({ email: email, username: username, password: password });

        sendVerificationEmail(user, req, res);
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
    
        const user: UserInstance = await User.findOne({ where: { email } });
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const isMatch: boolean = await user.comparePassword(password);
    
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ type: 'not-verified', message: 'Your account has not been verified.' });
        }
    
        const token: string = user.generateJWT();
    
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @route GET api/auth/verify/:token
 * @desc Google login
 * @access Public
 */
export const googleLogin = async (req: RequestWithUser, res: Response) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token: string = req.user.generateJWT();

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @route POST api/auth/verify/:token
 * @desc Email verification
 * @access Public
 */
export const verify = async (req: Request, res: Response) => {
    if(!req.params.token) return res.status(400).json({message: "We were unable to find a user for this token."});

    try {
        // Find a matching token
        const token: TokenInstance = await Token.findOne({where: {token: req.params.token}});

        if (!token) return res.status(400).json({message: 'We were unable to find a valid token. Your token my have expired.'});

        // If we found a token, find a matching user
        const user: UserInstance = await User.findOne({where: {id: token.userId}});

        if (!user) return res.status(400).json({message: 'We were unable to find a user for this token.'});

        // If the user is already verified
        if (user.isVerified) return res.status(400).json({message: 'This user has already been verified.'});

        // Verify and save the user
        user.isVerified = true;
        await user.save();

        res.status(200).json({message: "The account has been verified. Please log in."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**
 * @route POST api/auth/recover
 * @desc Send email to recover password
 * @access Public
 */
export const recoverPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user: UserInstance = await User.findOne({where: {email: email}});

        if (!user) return res.status(400).json({message: 'We were unable to find a user with that email.'});

        const token: TokenInstance = user.generateVerificationToken();

        // Save the verification token
        await token.save();

        const subject = "Password change request";
        const to = user.email;
        const link=`http://${req.headers.host}/api/auth/reset-password/${token.token}`;
        const html = `<p>Hi ${user.username}<p><br><p>Please click on the following <a href="${link}">link</a> to reset your password.</p>
                  <br><p>If you did not request this, please ignore this email.</p>`;

        await sendMail(to, subject, html);

        res.status(200).json({message: 'A reset email has been sent to ' + user.email + '.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**
 * @route GET api/auth/reset/:token
 * @desc Reset password
 * @access Public
 */
export const resetView = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        const tokenObj = await Token.findOne({where: {token: token}});

        if (!tokenObj) return res.status(400).json({message: 'We were unable to find a valid token. Your token my have expired.'});

        const user = await User.findOne({where: {id: tokenObj.userId}});

        if (!user) return res.status(400).json({message: 'We were unable to find a user for this token.'});

        //Redirect user to form with the email address
        res.render('reset', {user});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

/**
 * @route POST api/auth/reset/:token
 * @desc Reset password
 * @access Public
 */
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const tokenObj: TokenInstance = await Token.findOne({where: {token: token}});

        if (!tokenObj) return res.status(400).json({message: 'We were unable to find a valid token. Your token my have expired.'});

        const user: UserInstance = await User.findOne({where: {id: tokenObj.userId}});

        if (!user) return res.status(400).json({message: 'We were unable to find a user for this token.'});

        // Verify and save the user
        user.password = password;
        await user.save();

        res.status(200).json({message: "The password has been changed."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/**
 * Send verification email
 * @param user 
 * @param req 
 * @param res 
 */
async function sendVerificationEmail(user: UserInstance, req: Request, res: Response) {
    try{
        const token: TokenInstance = user.generateVerificationToken();

        // Save the verification token
        await token.save();

        const subject = "Account Verification Token";
        const to = user.email;
        const link="http://"+req.headers.host+"/api/auth/verify/"+token.token;
        const html = `<p>Hi ${user.username}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p>
                  <br><p>If you did not request this, please ignore this email.</p>`;

        await sendMail(to, subject, html);

        res.status(200).json({message: 'A verification email has been sent to ' + user.email + '.'});
    }catch (error) {
        res.status(500).json({message: error.message})
    }
}