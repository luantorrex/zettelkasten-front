(function() {
  const TOKEN_KEY = 'authToken';
  const USER_ID_KEY = 'userId';

  // Determine the base path of the application so that redirects work when the
  // app is served from a subdirectory.
  function getBasePath() {
    const parts = window.location.pathname
      .split('/')
      .filter(function(p) {
        return p;
      });
    if (
      parts.length > 0 &&
      ['notes', 'register', 'index.html'].includes(parts[parts.length - 1])
    ) {
      parts.pop();
    }
    return '/' + parts.join('/') + (parts.length > 0 ? '/' : '');
  }

  window.auth = {
    basePath: getBasePath,
    login(token, userId) {
      localStorage.setItem(TOKEN_KEY, token);
      if (userId !== undefined && userId !== null) {
        localStorage.setItem(USER_ID_KEY, userId);
      }
    },
    logout() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
      window.location.href = getBasePath();
    },
    isLoggedIn() {
      return (
        !!localStorage.getItem(TOKEN_KEY) &&
        !!localStorage.getItem(USER_ID_KEY)
      );
    },
    getUserId() {
      return localStorage.getItem(USER_ID_KEY);
    },
    requireAuth() {
      if (!this.isLoggedIn()) {
        this.logout();
      }
    },
    redirectToNotes() {
      // Always send the user to the notes page served from the front-end
      // development server running on port 8000.
      window.location.href = 'http://localhost:8000/notes';
    },
    redirectIfAuthenticated() {
      if (this.isLoggedIn()) {
        this.redirectToNotes();
      }
    }
  };
})();
