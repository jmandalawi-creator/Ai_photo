export function setToken(token) {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("auth-change")); // ✅ updates header instantly
}

export function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_email");
  window.dispatchEvent(new Event("auth-change")); // ✅ updates header instantly
}

// ✅ Alias so Header.jsx works without changes
export const logout = removeToken;

export function getToken() {
  return localStorage.getItem("token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
