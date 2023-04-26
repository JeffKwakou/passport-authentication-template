import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { OptionJwt } from '../models/option-jwt.model';
import { User } from '../models/User.schema';
import dotenv from 'dotenv';

dotenv.config();

const opts: OptionJwt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

export = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({ where: { id: jwt_payload.id } })
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
};