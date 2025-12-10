export function setToken(token) {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("auth-change")); 
}

export function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_email");
  window.dispatchEvent(new Event("auth-change")); 
}

export const logout = removeToken;

export function getToken() {
  return localStorage.getItem("token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
