const router = require('express').Router();
const { User, blogPost, Comment } = require('../models');
const withAuth = require('../utils/auth');




router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    const newUser = await User.create({
      username,
      password
    });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;
      res.status(200).json(newUser);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/homepage', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await blogPost.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await blogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
// router.get('/dashboard', async (req, res) => {
//   try {
    
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: blogPost }],
//     });

//     const user = userData.get({ plain: true });

//     res.render('dashboard', {
//       ...user,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
router.get('/dashboard', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: blogPost }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});


router.get('/post/edit/:id', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: blogPost }],
    });

    const user = userData.get({ plain: true });

    // Find the post data for the specified ID
    const postId = req.params.id;
    const postData = await blogPost.findByPk(postId);

    if (!postData) {
      res.status(404).json({ message: `Post with ID ${postId} not found` });
      return;
    }

    const post = postData.get({ plain: true });

    // Pass the user and post data to the update template
    res.render('update', {
      ...user,
      logged_in: true,
      post,
    });

  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/post/delete/:id', withAuth, async (req, res) => {
  try {
    const post = await blogPost.findByPk(req.params.id);

    // Check if the post exists and the user owns the post
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
    } else if (post.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'You are not authorized to delete this post' });
    } else {
      // Delete the post
      await post.destroy();

      // Redirect to the dashboard after deleting the post
      res.redirect('/dashboard');  
    }
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/post/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the blog post by ID
    const post = await blogPost.findByPk(postId);

    if (!post) {
      // If the post doesn't exist, return a 404 error
      res.status(404).json({ message: `Post with ID ${postId} not found` });
      return;
    }

    // Get all comments for the post
    const comments = await Comment.findAll({
      where: { postId },
      include: [{ model: User, attributes: ['username'] }],
    });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
