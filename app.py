from flask import Flask, render_template, request, jsonify
import sqlite3
from pathlib import Path

app = Flask(__name__)
DATABASE = Path(__file__).with_name("notes.db")


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_table():
    with get_db_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        connection.commit()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/notes", methods=["GET"])
def get_notes():
    with get_db_connection() as connection:
        notes = connection.execute(
            "SELECT id, content, created_at FROM notes ORDER BY id DESC"
        ).fetchall()
    return jsonify([dict(note) for note in notes])


@app.route("/api/notes", methods=["POST"])
def save_note():
    data = request.get_json(silent=True) or {}
    content = data.get("content", "").strip()

    if not content:
        return jsonify({"error": "Please write a note before saving."}), 400

    with get_db_connection() as connection:
        cursor = connection.execute(
            "INSERT INTO notes (content) VALUES (?)", (content,)
        )
        connection.commit()
        note = connection.execute(
            "SELECT id, content, created_at FROM notes WHERE id = ?",
            (cursor.lastrowid,)
        ).fetchone()

    return jsonify(dict(note)), 201


@app.route("/api/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    with get_db_connection() as connection:
        cursor = connection.execute("DELETE FROM notes WHERE id = ?", (note_id,))
        connection.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Note not found."}), 404
    return jsonify({"message": "Note deleted."})


if __name__ == "__main__":
    create_table()
    app.run(debug=True)
