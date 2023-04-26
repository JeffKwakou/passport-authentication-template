import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).send({ message: 'Unauthorized Access' });
        }

        req.body.user = user;

        next();
    })(req, res, next);
};