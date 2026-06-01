document.addEventListener('DOMContentLoaded', function() {
  const STORAGE_KEY = 'toffeeProfile';

  const profileView = document.getElementById('profileView');
  const profileName = document.getElementById('profileName');
  const regForm = document.getElementById('registerForm');
  const regDisplayName = document.getElementById('regDisplayName');
  const saveBtn = document.getElementById('saveProfile');
  const cancelBtn = document.getElementById('cancelRegister');
  const editBtn = document.getElementById('editProfile');
  const logoutBtn = document.getElementById('logoutProfile');

  function loadProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveProfile(obj) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    renderProfile();
  }

  function clearProfile() {
    localStorage.removeItem(STORAGE_KEY);
    renderProfile();
  }

  function renderProfile() {
    const p = loadProfile();
    if (p) {
      profileName.textContent = p.displayName || 'Creator';
      profileView.classList.remove('d-none');
      regForm.classList.add('d-none');

      // populate generator name if present
      const nameInput = document.getElementById('name');
      if (nameInput && (!nameInput.value || nameInput.value.trim() === '')) {
        nameInput.value = p.displayName || '';
      }
    } else {
      profileView.classList.add('d-none');
      regForm.classList.remove('d-none');
    }
  }

  // actions
  saveBtn.addEventListener('click', function() {
    const displayName = regDisplayName.value && regDisplayName.value.trim();
    saveProfile({ displayName });
  });

  editBtn.addEventListener('click', function() {
    const p = loadProfile();
    if (p) {
      regDisplayName.value = p.displayName || '';
    }
    profileView.classList.add('d-none');
    regForm.classList.remove('d-none');
    cancelBtn.classList.remove('d-none');
  });

  cancelBtn.addEventListener('click', function() {
    cancelBtn.classList.add('d-none');
    renderProfile();
  });

  logoutBtn.addEventListener('click', function() {
    clearProfile();
  });

  // init
  renderProfile();
});
