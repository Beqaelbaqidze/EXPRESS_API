import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

// Configure Local Strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await AppDataSource.manager.findOne(User, { where: { username } });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize user into the session
passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await AppDataSource.manager.findOne(User, { where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Login route handler
export const login = passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
});

// Profile route handler
export const profile = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user = req.user as User;
    const id = user.id;
    AppDataSource.manager
      .findOne(User, { where: { id } })
      .then((user) => {
        res.send('Welcome, ' + user.username);
      })
      .catch((error) => {
        console.error('Error fetching user by ID:', error);
        res.status(500).send('Internal Server Error');
      });
  } else {
    res.redirect('/login');
  }
};
