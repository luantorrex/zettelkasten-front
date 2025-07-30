(function() {
  var app = angular.module('notesApp', []);

  app.controller('NotesController', function($http) {
    var self = this;
    var API_BASE = 'http://localhost:3000/notes';

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
      $http.post(API_BASE, self.newNote).then(function(res) {
        self.notes.push(res.data);
        self.newNote = {};
      });
    };

    self.deleteNote = function(note) {
      $http.delete(API_BASE + '/' + note._id).then(function() {
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
      $http.put(API_BASE + '/' + self.editing._id, self.editNoteData).then(function(res) {
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
