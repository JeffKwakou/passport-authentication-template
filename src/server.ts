import express from 'express';
import passport from 'passport';
import jwtMiddleware from './middlewares/jwt.middleware';
import cors from 'cors';

import { authRoutes } from './auth/routes';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(passport.initialize());
jwtMiddleware(passport);

// Routes
app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));