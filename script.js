const addBox = document.querySelector(".add-box"),
    addNew = document.querySelector(".add-box .add"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector("input"),
    descTag = popupBox.querySelector("textarea"),
    addBtn = popupBox.querySelector("button"),
    deleteAll = document.querySelector(".bottom .settings");

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

const notes = JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdate = false, updateId;

addNew.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});


function showNotes() {
    if (!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <div class="line"></div>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="fas fa-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="fas fa-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="fas fa-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
        // console.log(note.title, document.querySelector(".note .details p").clientHeight, document.querySelector(".bottom-content").clientHeight)
    });
}

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    popupBox.classList.add("show");
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
        description = descTag.value.trim();
    if (title || description) {
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();

        // if (title.length > 15) {
        //     title = title.slice(0, 15) + "\n" + title.slice(15);
        // }
        let noteInfo = { title, description, date: `${month} ${day}, ${year}` }
        if (!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});
function check() {
    if (navigator.onLine) {
        document.querySelector('.wrapper').style.display = 'grid';
        document.querySelector('.pageError').style.display = 'none';
        document.querySelector('body').style.cursor = 'default';
        showNotes();
    }
    else {
        document.querySelector('.wrapper').style.display = 'none';
        document.querySelector('.pageError').style.display = 'flex';
        document.querySelector('body').style.cursor = 'wait';
    }
}

deleteAll.addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all notes?")) {
        localStorage.removeItem("notes");
        notes.splice(0, notes.length);
        localStorage.setItem("notes", JSON.stringify(notes));
        setTimeout(() => {
            showNotes();
            location.reload();
        }, 500);
    }
});

document.onload = check();
