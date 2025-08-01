(function() {
  var app = angular.module('notesApp', []);

  app.controller('NotesController', function($http) {
    var self = this;
    var API_BASE = 'http://localhost:3000/notes/';
    var FAVORITES_API = 'http://localhost:3000/favorites/';
    var USER_ID = localStorage.getItem('userId');
    if (!USER_ID) {
      window.location.href = '/';
      return;
    }
    var USER_NOTES_URL = API_BASE + 'user/' + USER_ID;

    self.notes = [];
    self.newNote = {};
    self.editing = null;
    self.editNoteData = {};

    self.loadNotes = function() {
      $http.get(USER_NOTES_URL).then(function(res) {
        self.notes = res.data;
        return $http.get(FAVORITES_API + USER_ID, {
          headers: { accept: 'application/json' }
        });
      }).then(function(favRes) {
        var favorites = favRes.data;
        self.notes.forEach(function(note) {
          note.favorited = favorites.some(function(fav) {
            return fav.noteId === note._id;
          });
        });
      });
    };

    self.addNote = function() {
      var noteData = angular.copy(self.newNote);
      noteData.userId = USER_ID;
      $http.post(API_BASE, noteData).then(function(res) {
        self.notes.push(res.data);
        self.newNote = {};
        self.loadNotes();
      }, function(err) {
        console.error('Failed to add note', err);
      });
    };

    self.deleteNote = function(note) {
      $http.delete(API_BASE + note._id).then(function() {
        var index = self.notes.indexOf(note);
        if (index >= 0) {
          self.notes.splice(index, 1);
        }
      });
    };

    self.favoriteNote = function(note) {
      var payload = { userId: USER_ID, noteId: note._id };
      $http.post(FAVORITES_API, payload).then(function() {
        note.favorited = true;
      }, function(err) {
        console.error('Failed to favorite note', err);
      });
    };

    self.editNote = function(note) {
      self.editing = note;
      self.editNoteData = angular.copy(note);
    };

    self.updateNote = function() {
      var url = API_BASE + self.editing._id;
      var noteData = angular.copy(self.editNoteData);
      noteData.userId = USER_ID;
      $http.put(url, noteData).then(function(res) {
        var index = self.notes.indexOf(self.editing);
        if (index >= 0) {
          self.notes[index] = res.data;
        }
        self.editing = null;
        self.editNoteData = {};
      });
    };

    self.cancelEdit = function() {
      self.editing = null;
      self.editNoteData = {};
    };

    self.logout = function() {
      localStorage.removeItem('userId');
      window.location.href = '/';
    };

    self.loadNotes();
  });
})();
