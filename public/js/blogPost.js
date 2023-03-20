const newPostForm = document.querySelector('#new-post-form');

newPostForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.querySelector('#post-title').value;
  const content = document.querySelector('#post-content').value;

  try {
    const response = await fetch('/api/blog-posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content
      })
    });

    if (response.ok) {
      alert('Post created successfully!');
      window.location.href = '/dashboard';
    } else {
      throw new Error('Failed to create post');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to create post');
  }
});






const updatePostForm = document.getElementById('update-post-form');

updatePostForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const titleInput = document.getElementById('post-title');
  const contentInput = document.getElementById('post-content');

  const title = titleInput.value;
  const content = contentInput.value;

  const postId = updatePostForm.dataset.postId;

  const response = await fetch(`/api/blog-posts/update-posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content })
  });

  if (response.ok) {
    // Redirect to the dashboard after updating the post
    window.location.href = '/dashboard';
  } else {
    // Handle the error case
    const error = await response.json();
    console.error(error.message);
  }
});


const deletePostForm = document.getElementById('delete-post-form');

deletePostForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const postId = deletePostForm.dataset.postId;

  const response = await fetch(`/api/blog-posts/delete-post`, {
    method: 'DELETE',
    body: JSON.stringify({ postId })
  });

  if (response.ok) {
    // Reload the page to show the updated list of posts
    window.location.reload();
  } else {
    // Handle the error case
    const error = await response.json();
    console.error(error.message);
  }
});
