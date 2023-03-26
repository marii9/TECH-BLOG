const router = require('express').Router();
const { User, blogPost, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Define the route handler for creating a new blog post
router.post('/', withAuth, async (req, res) => {
  try {
    // Extract the post title and content from the request body
    const { title, content } = req.body;

    // Create a new blog post with the title and content
    const newPost = await blogPost.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id // Assign the author to the logged-in user's ID
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
router.put('/update-posts/:id', withAuth, async (req, res) => {
  try {
    // Find the blog post by ID
    const postId = req.params.id;
    const post = await blogPost.findByPk(postId);

    // Check if the post exists and the user owns the post
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
    } else if (post.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'You are not authorized to update this post' });
    } else {
      // Update the post title and content
      post.title = req.body.title;
      post.content = req.body.content;

      // Save the updated post
      await post.save();

      // Respond with a success message and the updated post
      res.status(200).json({
        message: 'Post updated successfully',
        post: post
      });
    }
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/delete-post/:id', withAuth, async (req, res) => {
  try {
    // Find the blog post by ID
    const post = await blogPost.findByPk(req.params.id);

    // Check if the post exists and the user owns the post
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
    } else if (post.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'You are not authorized to delete this post' });
    } else {
      // Delete the post
      await post.destroy();

      // Respond with a success message
      res.status(200).json({ message: 'Post deleted successfully' });
    }
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define the route handler for creating a new comment on a post
router.post('/comments/:postId', withAuth, async (req, res) => {
  try {
    // Find the post by ID
    const post = await blogPost.findByPk(req.params.postId);

    // Check if the post exists
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      // Extract the comment text from the request body
      const { text } = req.body;

      // Create a new comment on the post with the specified ID
      const newComment = await Comment.create({
        content: req.body.content,
        user_id: req.session.user_id, // Assign the author to the logged-in user's ID
        post_id: post.id
      });

      // Respond with a success message and the new comment
      res.status(201).json({
        message: 'New comment created successfully',
        comment: newComment
      });
    }
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Define the route handler for updating a comment on a post
router.put('/update-comment/:postId', withAuth, async (req, res) => {
  try {
    // Find the comment by ID
    const commentId = req.params.postId;
    const comment = await Comment.findByPk(commentId);

    // Check if the comment exists and the user owns the comment
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
    } else if (comment.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'You are not authorized to update this comment' });
    } else {
      // Update the comment text
      comment.text = req.body.text;

      // Save the updated comment
      await comment.save();

      // Respond with a success message and the updated comment
      res.status(200).json({
        message: 'Comment updated successfully',
        comment: comment
      });
    }
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/comment-delete/:id', withAuth, async function(req, res) {
  try {
    const comment = await Comment.findOne(req.params.id)
    if (!comment) {
      res.status(404).json({ message: 'comment not found' });
    }else{
    await comment.destroy();
    
    res.status(200).json({ message: 'comment deleted' });
    }
    }catch (e) {
  console.error(error);
  res.status(404).json({ message: 'server error' });
}
    })

  


module.exports = router;
