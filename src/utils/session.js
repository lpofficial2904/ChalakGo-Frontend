export function tokenExpiryDelay(token) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return Math.max(0, Number(payload.exp) * 1000 - Date.now());
  } catch {
    return 0;
  }
}

export function clearUserSession() {
  localStorage.removeItem("chalakgo_user_token");
  localStorage.removeItem("chalakgo_user");
  sessionStorage.removeItem("chalakgo_user_token");
  window.dispatchEvent(new Event(USER_SESSION_EVENT));
}

export const USER_SESSION_EVENT = "chalakgo:user-session-changed";

export function saveUserSession({ token, user }) {
  sessionStorage.setItem("chalakgo_user_token", token);
  localStorage.setItem("chalakgo_user_token", token);
  localStorage.setItem("chalakgo_user", JSON.stringify(user));
  window.dispatchEvent(new Event(USER_SESSION_EVENT));
}
