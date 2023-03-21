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