import express from 'express';
import { AppDataSource } from './data-source';
import { User } from './entity/User';

const app = express();
const port = 3000; // or any other port you prefer

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/create-user', async (req, res) => {
  try {
    console.log('Inserting a new user into the database...');

    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;

    await AppDataSource.manager.save(user);
    console.log('Saved a new user with id: ' + user.id);

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    console.log('Loading users from the database...');
    const users = await AppDataSource.manager.find(User);
    console.log('Loaded users: ', users);

    res.json(users);
  } catch (error) {
    console.error('Error loading users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to the database');

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch(error => console.log(error));
