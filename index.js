const baseURL = 'http://localhost:3000/posts';
const postList = document.getElementById('post-list');
const postDetail = document.getElementById('post-detail');
const newPostForm = document.getElementById('new-post-form');
const editPostForm = document.getElementById('edit-post-form');
const cancelEditBtn = document.getElementById('cancel-edit');

function displayPosts() {
  fetch(baseURL)
    .then(res => res.json())
    .then(posts => {
      postList.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;
        div.classList.add('post-item');
        div.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(div);
      });
      if (posts.length > 0) handlePostClick(posts[0].id);
    });
}

function handlePostClick(id) {
  fetch(`${baseURL}/${id}`)
    .then(res => res.json())
    .then(post => {
      postDetail.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p>${post.content}</p>
        <button onclick="showEditForm(${post.id}, '${post.title.replace(/'/g, "\\'")}', \`${post.content}\`)">Edit</button>
        <button onclick="deletePost(${post.id})">Delete</button>
      `;
    });
}

function addNewPostListener() {
  newPostForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    const newPost = { title, author, content };

    fetch(baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(() => {
        newPostForm.reset();
        displayPosts();
      });
  });
}

function showEditForm(id, title, content) {
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-content').value = content;
  editPostForm.classList.remove('hidden');

  editPostForm.onsubmit = function (e) {
    e.preventDefault();
    const updated = {
      title: document.getElementById('edit-title').value,
      content: document.getElementById('edit-content').value
    };

    fetch(`${baseURL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(() => {
        editPostForm.classList.add('hidden');
        displayPosts();
      });
  };
}

cancelEditBtn.addEventListener('click', () => {
  editPostForm.classList.add('hidden');
});

function deletePost(id) {
  fetch(`${baseURL}/${id}`, {
    method: 'DELETE'
  }).then(() => {
    postDetail.innerHTML = '<p>Post deleted.</p>';
    displayPosts();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayPosts();
  addNewPostListener();
});
