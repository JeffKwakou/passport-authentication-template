import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { User } from '../models/User.schema';
import dotenv from 'dotenv';

dotenv.config();

export = passport => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET_CODE,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback : true
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await User.findOne({ where: {googleId: profile.id} });
            
            if (existingUser) {
                return done(null, existingUser);
            }
            
            const newUser = await User.create({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.email,
                isVerified: profile.verified
            });

            await newUser.save();
            
            return done(null, newUser);
        } catch (error) {
            return done(error, false)
        }
    }
));
}