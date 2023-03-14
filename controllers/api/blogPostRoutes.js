const router = require('express').Router();
const { User } = require('../../models');

// Define the route handler for creating a new blog post
router.post('/posts', async (req, res) => {
  try {
    // Extract the post title and content from the request body
    const { title, content } = req.body;

    // Create a new blog post with the title and content
    const newPost = await BlogPost.create({
      title,
      content,
      author: req.session.userId // Assign the author to the logged-in user's ID
    });

    // Respond with a success message and the new post
    res.status(201).json({
      message: 'New post created successfully',
      post: newPost
    });
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;