const clock = document.querySelector("#clock");
const radioBtn = document.querySelectorAll("input[name=sort]");
const addBtn = document.querySelector("#addBtn");
const list = document.querySelector("ul");
const details = document.querySelector("#details");
const url = "/api/v1/tasks";
const http = new XMLHttpRequest();

window.onload = loadData();

//#region Event handlers
//TODO: Add eventListeners to submit button
for (let i = 0; i < radioBtn.length; i++) {
    radioBtn[i].addEventListener("click", loadData);
}

addBtn.addEventListener("click", createAddForm);
//#endregion

/**
 * Loads the data to Html document using spring boot api.
 */
function loadData() {
    console.debug("call loadData");

    startClock();

    while (list.lastElementChild) {
        list.removeChild(list.lastElementChild);
    }

    let command = this.value;
    if (typeof command == "undefined") {
        command = document.querySelector("input[name=sort]:checked").value;
    }

    let apiCmd = url + command;
    console.debug(radioBtn.value);
    console.debug(apiCmd);

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.debug(
                "response type: " + this.responseType,
                "response text: " + this.responseText
            );
            let myArr = JSON.parse(this.responseText);
            console.debug(myArr);
            fillList(myArr);
        }
    };
    http.open("GET", apiCmd, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send();
}
/**
 * Implements the clock.
 */
function startClock() {
    let now = new Date();
    let hour = now.getHours();
    let min = now.getMinutes();
    let sec = now.getSeconds();

    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    clock.innerHTML = hour + ":" + min + ":" + sec;
    setTimeout(startClock, 1000);
}

/**
 * Fills list elements with the data.
 * @param {Array<Object>} myArr - Array of objects to fill list elements
 */
function fillList(myArr) {
    console.debug("call fillList");
    for (let i = 0; i < myArr.length; i++) {
        list.appendChild(createListItem(myArr[i]));
    }
}

/**
 * Creates a list item in the DOM.
 * @param {Object} content - Object to use in List item.
 * @return {<li> element} li element with data.
 */
function createListItem(content) {
    console.debug("call createListItem");
    let item = document.createElement("li");
    item.textContent = toShortString(content);
    // TODO: Add event listeners to list items for details
    return item;
}

/**
 * Formats an object into a sting description(no details).
 * @param {Object} obj - Data object.
 * @return {String} Returns a string.
 */
function toShortString(obj) {
    return (
        "Id: " +
        obj.id +
        " " +
        "Description: " +
        obj.description +
        " " +
        "Due Date: " +
        obj.dueDate
    );
}

// TODO: add functionality to the field add labels and names

/**
 * Creates a form element with inputs.
 */
function createAddForm() {
    let addForm = createForm("addForm");
    var desc = createInput("text", "desc");
    var priority = createInput("text", "priority");
    let currentDate = new Date().toJSON().split("T")[0];
    var dueDate = createInput("date", "dueDate");
    dueDate.setAttribute("value", currentDate);
    dueDate.setAttribute("min", currentDate);
    var hasAlert = createInput("checkbox", "alert");
    hasAlert.setAttribute("value", true);
    var daysBefore = createInput("text", "daysBefore");
    var comments = document.createElement("textarea");
    comments.setAttribute("id", "comments");
    comments.setAttribute("placeHolder", "Your Comments Here...");
    var completed = createInput("checkbox", "isCompleted");
    completed.setAttribute("value", true);
    let add = createInput("button", "add", "Προσθήκη");
    let cancel = createInput("button", "cancel", "Ακύρωση");

    //#region addForm assembly
    addForm.appendChild(createLabel("desc", "Περιγραφή:"));
    addForm.appendChild(desc);
    addForm.appendChild(createLabel("priority", "Προτεραιότητα:"));
    addForm.appendChild(priority);
    addForm.appendChild(createLabel("dueDate", "Ημερομηνία:"));
    addForm.appendChild(dueDate);
    addForm.appendChild(createLabel("alert", "Υπενθύμιση:"));
    addForm.appendChild(hasAlert);
    addForm.appendChild(createLabel("daysBefore", "'Υπενθύμιση' Ημέρες πρίν:"));
    addForm.appendChild(daysBefore);
    addForm.appendChild(createLabel("comments", "Σχόλια:"));
    addForm.appendChild(comments);
    addForm.appendChild(createLabel("isCompleted", "Ολοκληρώθηκε:"));
    addForm.appendChild(completed);
    addForm.appendChild(add);
    addForm.appendChild(cancel);

    details.appendChild(addForm);
    //#endregion
    console.debug(hasAlert);
    //Disable add button when addForm is active
    addBtn.disabled = true;
}

/**
 * Creates a form element.
 * @param {String} id - Id attribute of the form element.
 * @return {<form> element} Returns a form element in the DOM with id attribute.
 */
function createForm(id) {
    let form = document.createElement("form");
    form.setAttribute("id", id);
    return form;
}

/**
 * Creates an input element in the DOM.
 * @summary Creates an input element in the DOM and specifies the type and id by the two string parameters
 * and optionally specifies the text of a button.
 * @param {String} type - Specifies what type the input element would be.
 * @param {String} id - Specifies the id attribute of the element to be created.
 * @param {String} text - Specifies the text attribute of a button element to be created default value = empty string.
 * @return {<input> element} Returns an input element in the DOM.
 */
function createInput(type, id, text = "") {
    console.debug("input attributes:", type, id);
    let element = document.createElement("INPUT");
    element.setAttribute("type", type);
    element.setAttribute("id", id);

    //TODO: refactor to accept text content too for text fields

    if (type === "button") {
        console.debug("text = ", text);
        element.value = text;
        if (id === "add") {
            element.addEventListener("click", addTask);
        }
        if (id === "cancel") {
            element.addEventListener("click", cleanForm);
        }
    }
    return element;
}
/**
 * Creates a label element in the DOM.
 * @summary Creates a label element that takes the id of the element that it's going to be attached to and a text with
 * the label context.
 * @param {String} id - a string that is the id of the element the label attaches to.
 * @param {String} text - the context of the label element.
 * @return {<label> element} Returns a label element.
 */
function createLabel(id, text) {
    let label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = text;
    return label;
}

//TODO: Add Edit function that pre fills the input elements with the values from the object selected

function addTask() {
    let task = new Object();

    //Descreption validation
    if (typeof desc.value == "undefined" || desc.value === "") {
        alert("Descreption can not be empty");
        return;
    } else {
        task.desc = desc.value;
    }
    let priorityLevel = parseInt(priority.value);
    task.priority =
        isNaN(priorityLevel) || priorityLevel < 1 || priorityLevel > 10
            ? 10
            : priorityLevel;
    task.dueDate = dueDate.value;
    let hasAlert = document.querySelector("#alert");
    task.alert = hasAlert.checked ? true : false;
    let reminder = parseInt(daysBefore.value);
    task.daysBefore = isNaN(reminder) || reminder < 0 ? 0 : reminder;
    task.comments = comments.value;
    let completed = document.querySelector("#isCompleted");
    console.debug(completed);
    task.completed = completed.checked ? true : false;

    console.debug(task);
    let httpSend = new XMLHttpRequest();

    httpSend.open("POST", url, true);
    httpSend.setRequestHeader("Content-Type", "application/json");
    httpSend.send(JSON.stringify(task));
    httpSend.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cleanForm();
            loadData();
        }
    };
}

/**
 * Cleans form and removes form elements.
 */
function cleanForm() {
    addForm.remove();
    addBtn.disabled = false;
}
