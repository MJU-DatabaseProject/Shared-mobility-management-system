$(document).ready(function () {
  var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(37.5737274, 126.9221698), // 지도의 중심좌표
      level: 6 // 지도의 확대 레벨
    };

  var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

  // 마커 이미지를 미리 정의
  var markerImages = {
    'S': 'images/1.png',
    'B': 'images/2.png',
    'station': 'images/station.png' // 대여소 마커 이미지 추가
  };

  // 마커가 중복될 경우의 오프셋 배열
  var offsetArray = [
    { lat: 0.0003, lon: 0.0003 },
    { lat: -0.0003, lon: -0.0003 },
    { lat: 0.0003, lon: -0.0003 },
    { lat: -0.0003, lon: 0.0003 }
  ];
  var offsetIndex = 0;

  function loadMobilityData() {
    $.getJSON('/api/mobility', function (data) {
      data.forEach(function (location) {
        addMarker(location);
      });
    });
  }

  function loadStationData() {
    $.getJSON('/api/stations', function (data) {
      data.forEach(function (station) {
        addStationMarker(station);
      });
    });
  }

  function addMarker(location) {
    var offset = offsetArray[offsetIndex % offsetArray.length];
    offsetIndex++;

    var markerPosition = new kakao.maps.LatLng(location.lat + offset.lat, location.lon + offset.lon);
    var markerImageSrc = markerImages[location.type] || markerImages['S']; // 기본적으로 킥보드 마커 사용
    var markerImage = new kakao.maps.MarkerImage(
      markerImageSrc,
      new kakao.maps.Size(35, 46), // 마커 이미지의 크기
      { offset: new kakao.maps.Point(12, 35) } // 마커 이미지의 좌표
    );

    var marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage // 마커 이미지 설정
    });

    marker.setMap(map);

    // 마커에 클릭 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function () {
      $('.mobility-info').show();
      $('.station-info').hide();
      // 데이터를 컨테이너에 표시
      $('.mobility-info .label.bold:contains("ID") .value').text(location.id);
      if (location.type === 'B' && location.battery === null) {
        $('.mobility-info .battery-status').text('N/A');
        $('.mobility-info .status').text(location.status);
      } else {
        $('.mobility-info .battery-status').text(location.battery + '%');
        $('.mobility-info .status').text(location.status);
      }

      $('.mobility-info .label.bold:contains("대여소") .station-name').text(location.station_name);
      $('.mobility-info .label img.icon').siblings('.value.address').text(location.address);
      $('.mobility-info .label:contains("제조일")').next('.value.reg_date').text(location.reg_date);
      $('.mobility-info .label:contains("정비 일자")').next('.value.main_date').text(location.main_date || '');
      $('.mobility-info .label:contains("정비 비용")').next('.value.main_cost').text(location.main_cost ? location.main_cost + '원' : '');
      $('.maintenance-textbox').val(location.main_content || '');

      // 모빌리티 타입에 따라 버튼 텍스트 및 색상 변경
      if (location.type === 'S') {
        $('.tab-button').text('킥보드').css('background-color', '#1c87c9');
      } else if (location.type === 'B') {
        $('.tab-button').text('자전거').css('background-color', '#27C077');
      }

      // 마커 클릭 시 해당 마커 지점으로 지도를 이동하고 확대
      map.setCenter(markerPosition);
      map.setLevel(3); // 확대 레벨을 조정 (숫자가 작을수록 더 확대됨)
    });
  }

  function addStationMarker(station) {
    var markerPosition = new kakao.maps.LatLng(station.lat, station.lon);
    var markerImageSrc = markerImages['station'];
    var markerImage = new kakao.maps.MarkerImage(
      markerImageSrc,
      new kakao.maps.Size(35, 46), // 마커 이미지의 크기
      { offset: new kakao.maps.Point(12, 35) } // 마커 이미지의 좌표
    );

    var marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage // 마커 이미지 설정
    });

    marker.setMap(map);

    // 마커에 클릭 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function () {
      $('.mobility-info').hide();
      $('.station-info').show();
      // 데이터를 컨테이너에 표시
      $('.station-info .label.bold:contains("대여소 ID") .value').text(station.id);
      $('.station-info .label.bold:contains("대여소 이름") .station-name').text(station.name);
      $('.station-info .label img.icon').siblings('.value.address').text(station.address);
      $('.station-info .label:contains("모빌리티 수")').next('.value.mobility-count').text(station.mobility_count);

      // 버튼 텍스트 및 색상 변경
      $('.tab-button').text('대여소').css('background-color', '#FFA500');

      // 마커 클릭 시 해당 마커 지점으로 지도를 이동하고 확대
      map.setCenter(markerPosition);
      map.setLevel(3); // 확대 레벨을 조정 (숫자가 작을수록 더 확대됨)
    });
  }

  // 페이지 로드 시 모빌리티와 대여소 데이터를 각각 불러옴
  loadMobilityData();
  loadStationData();
});
