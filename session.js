(function() {
  const TOKEN_KEY = 'authToken';
  const USER_ID_KEY = 'userId';

  window.auth = {
    login(token, userId) {
      localStorage.setItem(TOKEN_KEY, token);
      if (userId) {
        localStorage.setItem(USER_ID_KEY, userId);
      }
    },
    logout() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
      window.location.href = '/';
    },
    isLoggedIn() {
      return !!localStorage.getItem(TOKEN_KEY);
    },
    getUserId() {
      return localStorage.getItem(USER_ID_KEY);
    },
    requireAuth() {
      if (!this.isLoggedIn()) {
        window.location.href = '/';
      }
    },
    redirectIfAuthenticated() {
      if (this.isLoggedIn()) {
        window.location.href = '/notes/';
      }
    }
  };
})();
