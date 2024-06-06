document.addEventListener('DOMContentLoaded', () => {
  loadMobilities(1); // Load first page by default

  const searchForm = document.getElementById('searchForm');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput').value;
    searchMobilities(searchInput);
  });

  document.querySelectorAll('.pagination .page-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      loadMobilities(page);
    });
  });
});

function loadMobilities(page) {
  fetch(`/api/mo_edit?page=${page}`)
    .then(response => response.json())
    .then(data => {
      populateTable(data.records);
      setupPagination(data.totalPages, page);
    })
    .catch(error => console.error('Error:', error));
}

function searchMobilities(id) {
  fetch(`/api/mo_edit/search/${id}`)
    .then(response => response.json())
    .then(records => {
      populateTable(records);
    })
    .catch(error => console.error('Error:', error));
}

function populateTable(records) {
  const mobilityTableBody = document.getElementById('mobilityTableBody');
  mobilityTableBody.innerHTML = '';
  records.forEach(record => {
    const batt = record.batt !== null ? record.batt : 'N/A';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.mo_id}</td>
      <td>${record.model}</td>
      <td>${record.stat_id}</td>
      <td>${batt}</td>
      <td>${record.broken_yn}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="editMobility('${record.mo_id}')">수정</button>
        <button class="btn btn-danger btn-sm" onclick="deleteMobility('${record.mo_id}')">삭제</button>
      </td>
    `;
    mobilityTableBody.appendChild(row);
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
      loadMobilities(i);
    });
    pagination.appendChild(li);
  }
}

function editMobility(moId) {
  fetch(`/api/mo_edit/${moId}`)
    .then(response => response.json())
    .then(record => {
      localStorage.setItem('editMobility', JSON.stringify(record)); // Store mobility info in localStorage
      window.location.href = 'edit_mobility.html';
    })
    .catch(error => console.error('Error:', error));
}

function deleteMobility(moId) {
  if (confirm('정말로 삭제하시겠습니까?')) {
    fetch(`/api/mo_edit/${moId}`, {
      method: 'DELETE'
    })
    .then(() => {
      location.reload();
    })
    .catch(error => console.error('Error:', error));
  }
}
