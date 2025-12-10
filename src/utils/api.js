const API_URL = import.meta.env.VITE_API_URL;

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

export async function getCredits(userId) {
  const res = await fetchWithAuth(`${API_URL}/payments/credits?user_id=${userId}`);
  const data = await res.json();
  return data.credits || 0;
}

export async function spendCredits(userId, amount = 1) {
  const res = await fetchWithAuth(`${API_URL}/payments/spend-credits`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId, amount }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Unable to deduct credits");
  return await res.json();
}

export async function getUserProfile(userId) {
  const res = await fetchWithAuth(`${API_URL}/auth/user/${userId}`);
  return await res.json();
}
