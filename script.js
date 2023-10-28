const addBox = document.querySelector(".add-box"),
    addNew = document.querySelector(".add-box .add"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector('input[type="text"]'),
    descTag = popupBox.querySelector("textarea"),
    addBtn = popupBox.querySelector('input[type="submit"]'),
    deleteAll = document.querySelector(".bottom .settings"),
    formData = document.querySelector("form");

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const notes = JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdate = false,
    updateId;

// click the plus(+) icon this funtion execute and show the form content
addNew.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    if (window.innerWidth > 660) titleTag.focus();
});

// clos button function in the form
closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

// add new note using js dynamically
function showNotes() {
    if (!notes) return;
    document.querySelectorAll(".note").forEach((li) => li.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", "<br/>");
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
    });
}

// show or hide the edit and delete button
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

// single note delete
function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return;
    showPopupWithCloseButton(`Your "${notes[noteId]['title'].toUpperCase()}" note was deleted successfully`);
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

// Update function
function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll("<br/>", "\r\n");
    updateId = noteId;
    isUpdate = true;
    popupBox.classList.add("show");
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.value = "Update Note";
}

// once click submit function in the form this function will execute
addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let title = titleTag.value.trim(),
        description = descTag.value.trim();
    if (title == "" || description == "") {
        checkRequired(title, description);
    } else {
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();

        let noteInfo = { title, description, date: `${day} ${month} ${year}` };
        if (!isUpdate) {
            notes.push(noteInfo);
            showPopupWithCloseButton(`Your "${notes[notes.length - 1]['title'].toUpperCase()}" note was added successfully`);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
            showPopupWithCloseButton(`Your "${notes[updateId]['title'].toUpperCase()}" note was updated successfully`);
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
        retriveNormal();
    }
});

// retrive the normal form style after new note is successfully  added
function retriveNormal() {
    formData.querySelector(".title").classList.remove("success");
    formData.querySelector(".description").classList.remove("success");
    formData.querySelector(".title").classList.remove("error");
    formData.querySelector(".description").classList.remove("error");
    formData.querySelector(".title p").innerText = "";
    formData.querySelector(".description p").innerText = "";
}
// This function check is online or offline
function check() {
    if (navigator.onLine) {
        document.querySelector(".wrapper").style.display = "grid";
        document.querySelector(".pageError").style.display = "none";
        document.querySelector("body").style.cursor = "default";
        showNotes();
    } else {
        console.log("offline");
        document.querySelector(".wrapper").style.display = "none";
        document.querySelector(".pageError").style.display = "flex";
        document.querySelector("body").style.cursor = "wait";
    }
}

// form validation
function checkRequired(title, description) {
    titleRequired(title);
    descriptionRequired(description);
}

// check the text field
function titleRequired(title) {
    if (title === "") {
        formData.querySelector(".title").classList.remove("success");
        formData.querySelector(".title").classList.add("error");
        formData.querySelector(".title p").innerText =
            " * please fill something in the Title";
    } else {
        formData.querySelector(".title").classList.remove("error");
        formData.querySelector(".title").classList.add("success");
        formData.querySelector(".title p").innerText = "";
    }
}

// check the textarea field
function descriptionRequired(description) {
    if (description === "") {
        formData.querySelector(".description").classList.remove("success");
        formData.querySelector(".description").classList.add("error");
        formData.querySelector(".description p").innerText =
            " * please fill something in the Description";
    } else {
        formData.querySelector(".description").classList.remove("error");
        formData.querySelector(".description").classList.add("success");
        formData.querySelector(".description p").innerText = "";
    }
}

// arrow function for delete all operation
deleteAll.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all notes?")) {
        showPopupWithCloseButton("Please wait your datas are deleting...");
        localStorage.removeItem("notes");
        notes.splice(0, notes.length);
        localStorage.setItem("notes", JSON.stringify(notes));
        setTimeout(() => {
            showNotes();
            location.reload();
        }, 500);
    }
});

// for popup
const popupContainer = document.querySelector(".popupMessagebox");
const closeButton = document.querySelector(".close-button");
const popupMessage = document.querySelector(".popup-message");
// Function to show the popup with a close button and a custom message
function showPopupWithCloseButton(message) {
    popupMessage.textContent = message;
    closeButton.textContent = "✖";
    popupContainer.style.display = "flex";
    closeButton.addEventListener("click", hidePopup);
    setTimeout(hidePopup, 5000);
}

// Function to hide the popup
function hidePopup() {
    popupContainer.style.display = "none";
}

function dom() {
    document.addEventListener("DOMContentLoaded", () => {
        check();
    });
}

// to run the all dom content loaded before render
window.onload = dom();
