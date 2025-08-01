# Zettelkasten Front

This repository contains the front-end of the Zettelkasten project. It is built using **AngularJS** and communicates with the REST API provided by the backend service.

## Project Status

The project is at its initial stage. More information will be added as development progresses.

## Getting Started

1. Clone this repository.
2. Install dependencies after setting up your Angular environment.
3. Run the development server (serves the front-end at `http://localhost:8000`). Visit `http://localhost:8000/` for the login page and `http://localhost:8000/notes/` for notes.
4. Ensure the backend API is running (by default at `http://localhost:3000`).

```
# Example steps
npm install
npm start
```

The backend is expected to run separately. Check the backend repository for details.
The front-end expects the following note endpoints to be available:

```
POST   /notes
GET    /notes
GET    /notes/{note_id}
PUT    /notes/{note_id}
DELETE /notes/{note_id}
```

Update the `API_BASE` variable in `app.js` if your backend runs on a different URL.

