(function() {
  var app = angular.module('notesApp', []);

  app.controller('NotesController', function($http) {
    var self = this;
    var API_BASE = 'http://localhost:3000/notes/';
    var FAVORITES_API = 'http://localhost:3000/favorites/';
    var TAGS_API = 'http://localhost:3000/tags/';
    var USER_ID = localStorage.getItem('userId');
    if (!USER_ID) {
      window.location.href = '/';
      return;
    }
    var USER_NOTES_URL = API_BASE + 'user/' + USER_ID;
    var USER_TAGS_URL = TAGS_API + 'user/' + USER_ID;

    self.notes = [];
    self.newNote = {};
    self.adding = false;
    self.editing = null;
    self.editNoteData = {};
    self.tags = [];
    self.newTag = {};
    self.addingTag = false;
    self.username = localStorage.getItem('username') || 'User';

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
            return fav._id === note._id;
          });
        });
      });
    };

    self.loadTags = function() {
      $http.get(USER_TAGS_URL).then(function(res) {
        self.tags = res.data;
      });
    };

    self.openAddModal = function() {
      self.adding = true;
      self.newNote = {};
    };

    self.cancelAdd = function() {
      self.adding = false;
      self.newNote = {};
    };

    self.addNote = function() {
      var noteData = angular.copy(self.newNote);
      noteData.userId = USER_ID;
      $http.post(API_BASE, noteData).then(function(res) {
        self.notes.push(res.data);
        self.newNote = {};
        self.adding = false;
        self.loadNotes();
      }, function(err) {
        console.error('Failed to add note', err);
      });
    };

    self.openTagModal = function() {
      self.addingTag = true;
      self.newTag = {};
    };

    self.cancelTag = function() {
      self.addingTag = false;
      self.newTag = {};
    };

    self.addTag = function() {
      var tagData = angular.copy(self.newTag);
      tagData.userId = USER_ID;
      $http.post(TAGS_API, tagData).then(function(res) {
        self.newTag = {};
        self.addingTag = false;
        self.loadTags();
      }, function(err) {
        console.error('Failed to add tag', err);
      });
    };

    self.deleteTag = function(tag) {
      $http.delete(TAGS_API + tag.tag_id).then(function() {
        var index = self.tags.indexOf(tag);
        if (index >= 0) {
          self.tags.splice(index, 1);
        }
      }, function(err) {
        console.error('Failed to delete tag', err);
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

    self.unfavoriteNote = function(note) {
      $http.delete(FAVORITES_API + note._id).then(function() {
        note.favorited = false;
      }, function(err) {
        console.error('Failed to remove favorite', err);
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
    self.loadTags();
  });
})();
