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






 

const deletePostForm = document.getElementById('delete-post-form');

deletePostForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const postId = deletePostForm.dataset.postId;

  const response = await fetch(`/api/blog-posts/delete-post/${postId} `, {
    method: 'DELETE',
    body: JSON.stringify({title, content })
  });

  if (response.ok) {
    // Reload the page to show the updated list of posts
    window.location.href = '/dashboard';
  } else {
    // Handle the error case
    const error = await response.json();
    console.error(error.message);
  }
});