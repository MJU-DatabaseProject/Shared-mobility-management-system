document.addEventListener("DOMContentLoaded", () => {
  loadSupportData();
});

function loadSupportData() {
  fetch("/api/support")
    .then((response) => response.json())
    .then((data) => {
      populateTable(data);
    })
    .catch((error) => console.error("Error:", error));
}

function populateTable(supports) {
  const supportTableBody = document.getElementById("supportTableBody");
  supportTableBody.innerHTML = "";
  supports.forEach((support) => {
    const row = document.createElement("tr");
    const statusClass =
      support.resp_stat === "Y" ? "status-answered" : "status-pending";
    row.innerHTML = `
      <td class="${statusClass}">${
      support.resp_stat === "Y" ? "답변 완료" : "답변 대기"
    }</td>
      <td><a href="#" onclick="toggleSupportDetail('${
        support.support_id
      }', this)">${support.support_text}</a></td>
      <td>${support.user_id}</td>
      <td>${new Date(support.reg_date).toLocaleDateString()}</td>
    `;
    supportTableBody.appendChild(row);
  });
}

function toggleSupportDetail(supportId, element) {
  const detailRow = document.querySelector(
    `.detail-row[data-support-id='${supportId}']`
  );
  if (detailRow) {
    // 이미 열려 있는 경우, 닫기
    detailRow.remove();
    return;
  }

  fetch(`/api/support/${supportId}`)
    .then((response) => response.json())
    .then((support) => {
      const newDetailRow = document.createElement("tr");
      newDetailRow.classList.add("detail-row");
      newDetailRow.setAttribute("data-support-id", supportId);
      newDetailRow.innerHTML = `
          <td colspan="4">
            <p><strong>질문:</strong> ${support.support_text}</p>
            ${
              support.resp_stat === "Y"
                ? `
            <div>
              <p><strong>답변:</strong> ${support.response_text}</p>
            </div>`
                : `
            <div class="answer-container">
              <textarea id="responseInput_${supportId}" class="form-control" rows="3" placeholder="답변을 작성하세요..."></textarea>
              <button type="button" class="btn btn-primary mt-2" onclick="submitResponse('${supportId}')">답변 등록</button>
            </div>`
            }
          </td>
        `;
      // 이미 다른 상세 정보가 열려 있다면 닫기
      const openDetailRow = document.querySelector(".detail-row");
      if (openDetailRow) {
        openDetailRow.remove();
      }
      // 선택한 질문 아래에 상세 정보 추가
      element.closest("tr").after(newDetailRow);
    })
    .catch((error) => console.error("Error:", error));
}

function submitResponse(supportId) {
  const responseText = document.getElementById(
    `responseInput_${supportId}`
  ).value;

  fetch(`/api/support/${supportId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ response_text: responseText }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loadSupportData();
      } else {
        console.error("Error:", data.error);
      }
    })
    .catch((error) => console.error("Error:", error));
}
