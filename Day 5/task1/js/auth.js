/**
 * Netflix Clone - Auth & Session (localStorage)
 */
(function () {
  const USERS_KEY = "netflix_users";
  const SESSION_KEY = "netflix_session";
  const PROFILE_KEY = "netflix_profile";

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function seedDemoUser() {
    const users = getUsers();
    if (!users.some((u) => u.email === "demo@netflix.com")) {
      users.push({
        email: "demo@netflix.com",
        password: "demo123",
        profiles: [
          { id: "1", name: "Sagar", avatar: "blue", isKids: false },
          { id: "2", name: "Kids", avatar: "yellow", isKids: true },
        ],
      });
      saveUsers(users);
    }
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  }

  function setSession(email) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email, loggedInAt: Date.now() }));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PROFILE_KEY);
  }

  function getSelectedProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY));
    } catch {
      return null;
    }
  }

  function setSelectedProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  function findUser(email) {
    return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  function register(email, password) {
    if (findUser(email)) {
      return { ok: false, message: "An account with this email already exists." };
    }
    const users = getUsers();
    users.push({
      email,
      password,
      profiles: [
        { id: String(Date.now()), name: email.split("@")[0], avatar: "red", isKids: false },
      ],
    });
    saveUsers(users);
    setSession(email);
    return { ok: true };
  }

  function login(email, password) {
    const user = findUser(email);
    if (!user || user.password !== password) {
      return { ok: false, message: "Incorrect email or password. Please try again." };
    }
    setSession(email);
    return { ok: true };
  }

  function getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    return findUser(session.email);
  }

  function requireAuth(redirectTo) {
    if (!getSession()) {
      window.location.href = redirectTo || "login.html";
      return false;
    }
    return true;
  }

  function requireProfile(redirectTo) {
    if (!requireAuth("login.html")) return false;
    if (!getSelectedProfile()) {
      window.location.href = redirectTo || "profiles.html";
      return false;
    }
    return true;
  }

  function logout() {
    clearSession();
    window.location.href = "index.html";
  }

  seedDemoUser();

  window.NetflixAuth = {
    register,
    login,
    logout,
    getSession,
    getCurrentUser,
    getSelectedProfile,
    setSelectedProfile,
    requireAuth,
    requireProfile,
    clearSession,
  };
})();
