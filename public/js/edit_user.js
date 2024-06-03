$(document).ready(function() {
    const user = JSON.parse(localStorage.getItem('editUser'));
    if (user) {
      $('#userId').val(user.user_id);
      $('#userName').val(user.user_name);
  
      // Format dates to YYYY-MM-DD or YYYY-MM-DDTHH:MM
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
  
      const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
  
      $('#userBirth').val(formatDate(user.user_birth));
      $('#userContact').val(user.user_tel);
      $('#userJoinDate').val(formatDateTime(user.user_join_date));
      $('#userRentRight').val(user.rent_right);
      $('#userState').val(user.user_state);
      $('#userWithdrawalDate').val(formatDateTime(user.withdraw_date));
    }
  
    $('#editUserForm').submit(function(event) {
      event.preventDefault();
      const updatedUser = {
        user_name: $('#userName').val(),
        user_birth: $('#userBirth').val(),
        user_tel: $('#userContact').val(),
        rent_right: $('#userRentRight').val(),
        user_state: $('#userState').val(),
        withdraw_date: $('#userWithdrawalDate').val() || null // Convert empty string to null
      };
  
      fetch(`/api/users/${user.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      })
      .then(response => response.json())
      .then(data => {
        alert('회원 정보가 수정되었습니다.');
        localStorage.removeItem('editUser'); // 수정 후 로컬 스토리지에서 제거
        window.location.href = 'user.html';
      })
      .catch(error => console.error('Error:', error));
    });
  });
  