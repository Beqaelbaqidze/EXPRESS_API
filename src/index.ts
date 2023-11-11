import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import path from 'path';

// Define a User interface that extends the User entity with the passport property
interface UserWithPassport extends User {
  passport: {
    user: string;
  };
}

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;

    await AppDataSource.manager.save(user);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const existingUser = await AppDataSource.manager.findOne(User, { where: { username } });

      if (!existingUser) {
        return done(null, false, { message: 'User not found' });
      }

      if (existingUser.password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, existingUser);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: UserWithPassport, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await AppDataSource.manager.findOne(User, { where: { id } });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as UserWithPassport;
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
});


AppDataSource.initialize()
  .then(() => {
    console.log('Connected to the database');
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch(error => console.log(error));
