$(document).ready(function() {
    const mobility = JSON.parse(localStorage.getItem('editMobility'));
    if (mobility) {
      $('#mo_id').val(mobility.mo_id);
      $('#model').val(mobility.model);
      $('#station_id').val(mobility.stat_id);
      $('#location_id').val(mobility.location_id);
      $('#manu_date').val(formatDate(mobility.manu_date));
      $('#broken_yn').val(mobility.broken_yn);
      $('#last_main_date').val(formatDate(mobility.last_main_date));
      $('#batt').val(mobility.batt !== null ? mobility.batt : 'N/A');
      $('#mo_type').val(mobility.mo_type);
    }
  
    // Format dates to YYYY-MM-DD
    function formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  
    $('#editMobilityForm').submit(function(event) {
      event.preventDefault();
      const updatedMobility = {
        broken_yn: $('#broken_yn').val(),
        last_main_date: $('#last_main_date').val()
      };
  
      fetch(`/api/mo_edit/${mobility.mo_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMobility)
      })
      .then(response => response.json())
      .then(data => {
        alert('모빌리티 정보가 수정되었습니다.');
        localStorage.removeItem('editMobility'); // 수정 후 로컬 스토리지에서 제거
        window.location.href = 'mobility.html';
      })
      .catch(error => console.error('Error:', error));
    });
  });
  