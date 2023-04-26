import express from 'express';
import passport from 'passport';
import jwtMiddleware from './middlewares/jwt.middleware';

import { authRoutes } from './auth/routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(passport.initialize());
jwtMiddleware(passport);

// Routes
app.use('/auth', authRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));