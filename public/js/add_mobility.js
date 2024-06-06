document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addMobilityForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const newMobility = {
        mo_id: document.getElementById('mo_id').value,
        model: document.getElementById('model').value,
        stat_id: document.getElementById('station_id').value,
        location_id: document.getElementById('location_id').value,
        manu_date: document.getElementById('manu_date').value,
        batt: document.getElementById('batt').value,
        mo_type: document.getElementById('mo_type').value,
        broken_yn: document.getElementById('broken_yn').value,
        last_main_date: document.getElementById('last_main_date').value
      };
      
      console.log('Submitting new mobility:', newMobility);
      
      addMobility(newMobility);
    });
  });
  
  function addMobility(mobility) {
    fetch('/api/mo_edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mobility)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Response from server:', data);
      alert('모빌리티가 추가되었습니다.');
      window.location.href = 'mo_manage.html';
    })
    .catch(error => {
      console.error('Error:', error);
      alert('모빌리티 추가 중 오류가 발생했습니다.');
    });
  }
  