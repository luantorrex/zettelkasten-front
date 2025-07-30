(function() {
  var app = angular.module('notesApp', []);

  app.controller('NotesController', function($window) {
    var self = this;
    self.notes = JSON.parse($window.localStorage.getItem('notes')) || [];
    self.newNote = {};
    self.editing = -1;
    self.editNoteData = {};

    self.addNote = function() {
      self.notes.push({
        title: self.newNote.title,
        content: self.newNote.content
      });
      self.newNote = {};
      self.save();
    };

    self.deleteNote = function(index) {
      self.notes.splice(index, 1);
      self.save();
    };

    self.editNote = function(index) {
      self.editing = index;
      self.editNoteData = angular.copy(self.notes[index]);
    };

    self.updateNote = function() {
      self.notes[self.editing] = angular.copy(self.editNoteData);
      self.editing = -1;
      self.editNoteData = {};
      self.save();
    };

    self.cancelEdit = function() {
      self.editing = -1;
      self.editNoteData = {};
    };

    self.save = function() {
      $window.localStorage.setItem('notes', JSON.stringify(self.notes));
    };
  });
})();
