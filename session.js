(function() {
  const STORAGE_KEY = 'authToken';

  window.auth = {
    login(token) {
      localStorage.setItem(STORAGE_KEY, token);
    },
    logout() {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = '/';
    },
    isLoggedIn() {
      return !!localStorage.getItem(STORAGE_KEY);
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
