const router = require('express').Router();
const { User } = require('../../models');

router.post('/signup', async (req, res) => {
  try {
    // Get the user input from the signup form
    const { username, password } = req.body;

    // Create a new user in the database
    const newUser = await User.create({
      username,
      password,
    });

    // Set the 'logged_in' session variable to true and store the user ID
    req.session.logged_in = true;
    req.session.user_id = newUser.id;

    // Redirect to the user's profile page
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('signup');
});


router.post('/login', async (req, res) => {

  try {
    console.log(req.body);
    const userData = await User.findOne({ where: { username: req.body.username } });
console.log(userData);
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
