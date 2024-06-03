document.addEventListener('DOMContentLoaded', () => {
    loadUsers(1); // Load first page by default
  
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const searchInput = document.getElementById('searchInput').value;
      searchUsers(searchInput);
    });
  
    document.querySelectorAll('.pagination .page-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        loadUsers(page);
      });
    });
  });
  
  function loadUsers(page) {
    fetch(`/api/users?page=${page}`)
      .then(response => response.json())
      .then(data => {
        populateTable(data.users);
        setupPagination(data.totalPages, page);
      })
      .catch(error => console.error('Error:', error));
  }
  
  function searchUsers(name) {
    fetch(`/api/users/search/${name}`)
      .then(response => response.json())
      .then(users => {
        populateTable(users);
      })
      .catch(error => console.error('Error:', error));
  }
  
  function populateTable(users) {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = '';
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.user_name}</td>
        <td>${user.user_id}</td>
        <td>${new Date(user.user_join_date).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="editUser('${user.user_id}')">수정</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.user_id}')">삭제</button>
        </td>
      `;
      userTableBody.appendChild(row);
    });
  }
  
  function setupPagination(totalPages, currentPage) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';
  
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      if (i == currentPage) {
        li.classList.add('active');
      }
      li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
      li.querySelector('.page-link').addEventListener('click', function (e) {
        e.preventDefault();
        loadUsers(i);
      });
      pagination.appendChild(li);
    }
  }
  
  function editUser(userId) {
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(user => {
        localStorage.setItem('editUser', JSON.stringify(user)); // Store user info in localStorage
        window.location.href = 'edit_user.html';
      })
      .catch(error => console.error('Error:', error));
  }
  
  function deleteUser(userId) {
    if (confirm('정말로 삭제하시겠습니까?')) {
      fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })
      .then(() => {
        location.reload();
      })
      .catch(error => console.error('Error:', error));
    }
  }
  