const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/client/admin-login.html';
}

const API_URL = '/api';

const tableBody = document.getElementById('studentsTable');
const filter = document.getElementById('trackFilter');

const totalStudents = document.getElementById('totalStudents');
const totalPaid = document.getElementById('totalPaid');
const totalPending = document.getElementById('totalPending');
const webDevCount = document.getElementById('webDevCount');

async function fetchUsers(track = '') {
  const token = localStorage.getItem('token');

  let url = `${API_URL}/users`;

  // If track is selected and not "All"
  if (track && track !== 'All') {
    url = `${API_URL}/users/track/${encodeURIComponent(track)}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: token,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    alert('Unauthorized. Please login again.');
    window.location.href = 'admin-login.html';
    return;
  }

  renderTable(data);
  updateStats(data);
}

function renderTable(users) {
  tableBody.innerHTML = '';

  users.forEach((user) => {
    const statusBadge =
      user.paymentStatus === 'paid'
        ? `<span class="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">Paid</span>`
        : `<span class="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs">Pending</span>`;

    const row = `
      <tr class="border-b border-white/5 hover:bg-white/5 transition">
        <td class="p-4">${user.fullName}</td>
        <td class="p-4">${user.email}</td>
        <td class="p-4">${user.phone}</td>
        <td>${user.address}</td>
<td>${user.state}</td>
<td>${user.age}</td>
<td>${user.gender}</td>
<td>${user.occupation}</td>
<td>${user.educationLevel}</td>
<td>${user.hasLaptop}</td>
<td>${user.priorTechExperience}</td>
        <td class="p-4">${user.track}</td>
        <td class="p-4">${statusBadge}</td>
        <td class="p-4">${new Date(user.createdAt).toLocaleDateString()}</td>
        <td class="p-4">
          <button onclick="deleteUser('${user._id}')" 
            class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-xs">
            Delete
          </button>
        </td>
        <td class="p-4">${user.paymentReference || '-'}</td>
      </tr>
    `;

    tableBody.innerHTML += row;
  });
}

function animateValue(element, end) {
  if (end === 0) {
    element.textContent = 0;
    return;
  }

  let start = 0;
  const duration = 800;
  const stepTime = Math.max(Math.floor(duration / end), 1);

  const timer = setInterval(() => {
    start++;
    element.textContent = start;
    if (start >= end) clearInterval(timer);
  }, stepTime);
}

function updateStats(users) {
  const total = users.length;
 const paid = users.filter(
  (u) => u.paymentStatus && u.paymentStatus.toLowerCase() === 'paid'
).length;
  const pending = users.filter(
    (u) => u.paymentStatus.toLowerCase() === 'pending'
  ).length;
  const webDev = users.filter((u) => u.track === 'Web Development').length;

  animateValue(totalStudents, total);
  animateValue(totalPaid, paid);
  animateValue(totalPending, pending);
  animateValue(webDevCount, webDev);
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });

  fetchUsers(filter.value);
}

filter.addEventListener('change', (e) => {
  fetchUsers(e.target.value);
});

// INITIAL LOAD
fetchUsers();

// search function
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
  const value = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll('#studentsTable tr');

  rows.forEach((row) => {
    const name = row.children[0].textContent.toLowerCase();
    row.style.display = name.includes(value) ? '' : 'none';
  });
});

// csv
function exportCSV() {
  fetch(`${API_URL}/users`, {
    headers: { Authorization: localStorage.getItem('token') },
  })
    .then((res) => res.json())
    .then((users) => {
      const csv = [
        ['Full Name', 'Email', 'Phone', "Address", "State", "Age", "Gender", "Occupation", "Education", "Laptop", "Tech Experience", 'Track', 'Status', 'Date'],
        ...users.map((u) => [
          u.fullName,
          u.email,
          u.phone,
          u.address,
          u.state,
          u.age,
          u.gender,
          u.occupation,
          u.educationLevel,
          u.hasLaptop,
          u.priorTechExperience,
          u.track,
          u.paymentStatus,
          new Date(u.createdAt).toLocaleDateString(),
        ]),
      ];

      const blob = new Blob([csv.map((r) => r.join(',')).join('\n')]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'students.csv';
      link.click();
    });
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'admin-login.html';
}
