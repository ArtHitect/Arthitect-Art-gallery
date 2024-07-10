// Load art posts on page load
document.addEventListener('DOMContentLoaded', () => {
    loadArtPosts();
});

// Load art posts from the API
async function loadArtPosts() {
    const response = await fetch('/api/art');
    const artPosts = await response.json();

    const postsGrid = document.querySelector('.posts-grid');
    postsGrid.innerHTML = '';

    artPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <img src="${post.imageUrl}" alt="${post.title}">
            <div class="post-info">
                <p>${post.title}</p>
                <p>${post.artist}</p>
            </div>
        `;
        postsGrid.appendChild(postElement);
    });
}

// Handle form submission for uploading new art
const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(uploadForm);

        const response = await fetch('/api/art', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Art uploaded successfully!');
            uploadForm.reset();
            loadArtPosts();
        } else {
            alert('Failed to upload art.');
        }
    });
}
