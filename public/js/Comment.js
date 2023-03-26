const commentForms = document.querySelectorAll('.new-comment-form');

commentForms.forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = form.getAttribute("data-post-id");
    const name = form.querySelector('#new-name').value;
    const content = form.querySelector('#comment-content').value;
    
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
});

