let currentRole = null;

export const login = (username, password) => {
  if (username === 'manager' && password === 'admin123') {
    currentRole = 'manager';
    return true;
  }
  if (username === 'coordinator' && password === 'viewonly') {
    currentRole = 'coordinator';
    return true;
  }
  return false;
};

export const getRole = () => currentRole;
export const logout = () => { currentRole = null };
