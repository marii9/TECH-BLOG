const newCommentForm = document.querySelector('.new-comment-form');

newCommentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
const title= newCommentForm.getAttribute("data-post-id")
const name= newCommentForm.getAttribute("#new-name");
  console.log(title);
  const content = document.querySelector('#comment-content').value;
console.log(content);
  try {
    const response = await fetch(`/api/blog-posts/comments/${title}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        name,
       content
      })
    });

    if (response.ok) {
      alert('Comment created successfully!');
      window.location.reload();
    } else {
      throw new Error('Failed to create comment');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to create comment');
  }
});

const updateCommentForm = document.getElementById('update-comment-form');

updateCommentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const postId = updateCommentForm.dataset.postId;
  const content = document.querySelector('#comment-content').value;

  const response = await fetch(`/api/blog-posts/update-comment/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });

  if (response.ok) {
    // Reload the page to show the updated comment
    window.location.reload();
  } else {
    // Handle the error case
    const error = await response.json();
    console.error(error.message);
  }
});

const deleteCommentForm = document.getElementById('delete-comment-form');

deleteCommentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const postId = deleteCommentForm.dataset.postId;

  const response = await fetch(`/api/blog-posts/delete-comment/${postId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    // Reload the page to show the updated list of comments
    window.location.reload();
  } else {
    // Handle the error case
    const error = await response.json();
    console.error(error.message);
  }
});











