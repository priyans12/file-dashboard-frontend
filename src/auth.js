// src/auth.js

export const login = (username, password) => {
  const credentials = {
    manager: 'admin123',
    coordinator: 'viewonly',
  };

  if (credentials[username] === password) {
    localStorage.setItem('userRole', username);
    return true;
  }

  return false;
};

export const getRole = () => {
  return localStorage.getItem('userRole');
};

export const logout = () => {
  localStorage.removeItem('userRole');
};
