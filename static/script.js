const noteInput = document.getElementById("noteInput");
const saveButton = document.getElementById("saveButton");
const notesList = document.getElementById("notesList");
const message = document.getElementById("message");
const noteCount = document.getElementById("noteCount");
const emptyState = document.getElementById("emptyState");
const charCount = document.getElementById("charCount");

noteInput.addEventListener("input", () => {
    const count = noteInput.value.length;
    charCount.textContent = `${count} character${count === 1 ? "" : "s"}`;
});

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}

function formatDate(dateString) {
    const date = new Date(dateString + " UTC");
    return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

async function loadNotes() {
    try {
        const response = await fetch("/api/notes");
        if (!response.ok) throw new Error("Could not load notes.");
        const notes = await response.json();
        notesList.innerHTML = "";
        noteCount.textContent = `${notes.length} note${notes.length === 1 ? "" : "s"}`;
        emptyState.hidden = notes.length !== 0;

        notes.forEach(note => {
            const card = document.createElement("article");
            card.className = "note-card";

            const content = document.createElement("p");
            content.className = "note-content";
            content.textContent = note.content;

            const meta = document.createElement("div");
            meta.className = "note-meta";

            const date = document.createElement("span");
            date.textContent = formatDate(note.created_at);

            const remove = document.createElement("button");
            remove.className = "delete-button";
            remove.textContent = "Delete";
            remove.addEventListener("click", () => deleteNote(note.id));

            meta.append(date, remove);
            card.append(content, meta);
            notesList.appendChild(card);
        });
    } catch (error) {
        showMessage(error.message, true);
    }
}

saveButton.addEventListener("click", async () => {
    const content = noteInput.value.trim();
    if (!content) {
        showMessage("Please write something before saving.", true);
        noteInput.focus();
        return;
    }

    saveButton.disabled = true;
    showMessage("Saving...");
    try {
        const response = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not save note.");
        noteInput.value = "";
        charCount.textContent = "0 characters";
        showMessage("Your note has been saved.");
        await loadNotes();
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        saveButton.disabled = false;
    }
});

async function deleteNote(id) {
    try {
        const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not delete note.");
        showMessage("Note deleted.");
        await loadNotes();
    } catch (error) {
        showMessage(error.message, true);
    }
}

loadNotes();
