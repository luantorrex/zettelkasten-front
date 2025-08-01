(function() {
  var app = angular.module('notesApp', []);

  app.controller('NotesController', function($http) {
    var self = this;
    var API_BASE = 'http://localhost:3000/notes/';
    var USER_ID = localStorage.getItem('userId');
    if (!USER_ID) {
      window.location.href = '/';
      return;
    }

    self.notes = [];
    self.newNote = {};
    self.editing = null;
    self.editNoteData = {};

    self.loadNotes = function() {
      $http.get(API_BASE).then(function(res) {
        self.notes = res.data;
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

    self.loadNotes();
  });
})();
