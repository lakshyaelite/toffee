document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'toffeeProfile';

  const profileView = document.getElementById('profileView');
  const profileName = document.getElementById('profileName');
  const regForm = document.getElementById('registerForm');
  const regDisplayName = document.getElementById('regDisplayName');
  const saveBtn = document.getElementById('saveProfile');
  const cancelBtn = document.getElementById('cancelRegister');
  const editBtn = document.getElementById('editProfile');
  const logoutBtn = document.getElementById('logoutProfile');
  const nameInput = document.getElementById('name');

  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function syncUI() {
    const profile = getProfile();
    if (profile && profile.displayName) {
      profileName.textContent = profile.displayName;
      profileView.classList.remove('d-none');
      regForm.classList.add('d-none');
      if (nameInput && !nameInput.value) {
        nameInput.value = profile.displayName;
      }
    } else {
      profileView.classList.add('d-none');
      regForm.classList.remove('d-none');
    }
  }

  saveBtn.addEventListener('click', () => {
    const value = regDisplayName.value.trim();
    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ displayName: value }));
      cancelBtn.classList.add('d-none');
      syncUI();
    }
  });

  editBtn.addEventListener('click', () => {
    const profile = getProfile();
    regDisplayName.value = profile ? profile.displayName : '';
    regForm.classList.remove('d-none');
    cancelBtn.classList.remove('d-none');
  });

  cancelBtn.addEventListener('click', () => {
    cancelBtn.classList.add('d-none');
    syncUI();
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    if (nameInput) nameInput.value = '';
    syncUI();
  });

  syncUI();
});