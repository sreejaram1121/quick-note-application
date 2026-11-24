# Quick Note Application

A simple single-page notes application built with HTML, CSS, JavaScript, Python Flask, and SQLite.

## Features
- Write and save notes without reloading the page.
- Send notes to a Python backend using the Fetch API.
- Store notes permanently in an SQLite database (`notes.db`).
- Display saved notes on the same page.
- Delete notes.
- Automatically create the database and table on first run.

## Requirements
- Python 3.9 or newer
- Internet connection for the first-time Flask installation

## Run the project

1. Extract the ZIP file.
2. Open a terminal/command prompt inside the `quick_note_application` folder.
3. Install Flask:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the application:

   ```bash
   python app.py
   ```

5. Open this address in your browser:

   `http://127.0.0.1:5000`

The `notes.db` database file is created automatically in the project folder. Your notes remain saved when you close and reopen the browser, as long as you keep this database file.

## How it works

1. The user types a note in the browser.
2. JavaScript sends the note to `POST /api/notes` as JSON.
3. Flask receives the request and validates the note.
4. Flask inserts the note into the SQLite database.
5. Flask sends a JSON response to the browser.
6. JavaScript fetches the saved notes from `GET /api/notes` and displays them without refreshing the page.

## Project structure

```text
quick_note_application/
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```
