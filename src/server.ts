import express from 'express';
import passport from 'passport';
import jwtMiddleware from './middlewares/jwt.middleware';
import googleMiddleware from './middlewares/google.middleware';
import cors from 'cors';

import { googleLogin } from './auth/auth.controller';

import { authRoutes } from './auth/routes';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(passport.initialize());
jwtMiddleware(passport);
googleMiddleware(passport);

app.get("/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get("/auth/google/callback",
    passport.authenticate("google", { session: false }),
    googleLogin
);

// Routes
app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));