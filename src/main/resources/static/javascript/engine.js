const clock = document.querySelector("#clock");
const radioBtn = document.querySelectorAll("input[name=sort]");
const addBtn = document.querySelector("#addBtn");
const list = document.querySelector("ul");
const details = document.querySelector("#details");
let activeForm = null;
let formElements = null;
const url = "/api/v1/tasks";
const http = new XMLHttpRequest();

window.onload = loadData();

//#region Event handlers
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
        console.debug(this.readyState, this.status);
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
    if (activeForm !== null) {
        cleanForm();
    }
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
    item.id = content.id;

    item.addEventListener("click", showDetails);
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

/**
 * Creates a form element with inputs for adding new Task.
 * (Rewired to be used as a callback for add event)
 */
function createAddForm() {
    if (activeForm !== null) {
        cleanForm();
    }
    formElements = createFullForm("addForm");
    activeForm = assembleForm(formElements);

    //Disable add button when addForm is active
    addBtn.disabled = true;
}

/**
 * Creates a full form base on the type and optionally sets the content.
 * @param {String} formType - String that specifies the type of form to be created.
 * @param {Object} content - Object that holds the values to be inserted to the form elements.
 * @return {Object} Returns an object that hold the DOM elements for the form.
 */
function createFullForm(formType, content = null) {
    let data = {
        id: 0,
        description: "",
        priority: "",
        dueDate: "",
        alert: "",
        daysBefore: "",
        comments: "",
        completed: "",
    };

    let readonly = false;

    console.debug("Content: " + content);
    if (content != null) {
        for (let key in content) {
            data[key] = content[key];
        }
        readonly = true;
    }
    console.debug("Data: ", data);

    let formElement = {};

    formElement.form = createForm(formType);
    formElement.desc = createInput("text", "desc", data.description, readonly);
    formElement.priority = createInput(
        "text",
        "priority",
        data.priority,
        readonly
    );
    let currentDate =
        data.dueDate == "" ? new Date().toJSON().split("T")[0] : data.dueDate;
    formElement.dueDate = createInput("date", "dueDate", currentDate, readonly);
    formElement.hasAlert = createInput(
        "checkbox",
        "alert",
        data.alert,
        readonly
    );
    formElement.daysBefore = createInput(
        "text",
        "daysBefore",
        data.daysBefore,
        readonly
    );
    formElement.comments = createInput(
        "textarea",
        "comments",
        data.comments,
        readonly
    );
    formElement.completed = createInput(
        "checkbox",
        "isCompleted",
        data.completed,
        readonly
    );

    //TODO: Add check for addForm or detailForm for different buttons

    formElement.add = createInput("button", "add", "Προσθήκη", readonly);
    formElement.cancel = createInput("button", "cancel", "Ακύρωση");

    return formElement;
}

/**
 * Calls the api and loads the form with the appropriate data.
 */
function showDetails() {
    if (activeForm !== null) {
        cleanForm();
    }
    let httpFind = new XMLHttpRequest();
    console.debug("Event id: " + this.id);

    httpFind.onreadystatechange = function () {
        console.debug(this.readyState, this.status);
        if (this.readyState == 4 && this.status == 200) {
            console.debug(
                "response type: " + this.responseType,
                "response text: " + this.responseText
            );
            let dataObj = JSON.parse(this.responseText);
            console.debug(dataObj);
            formElements = createFullForm("detailForm", dataObj);
            activeForm = assembleForm(formElements, dataObj);
        }
    };
    let apiPath = url + "/" + parseInt(this.id);
    httpFind.open("GET", apiPath, true);
    httpFind.setRequestHeader("Content-Type", "application/json");
    httpFind.send();
}

/**
 * Assembles the form created to the Html tree.
 * @param {Object} form - Data Object that hold the form elements.
 * @return {<form> HTMLElement} Returns the form element with its children.
 */
function assembleForm(form, dataObj) {
    let showForm = form.form;
    showForm.appendChild(createLabel("desc", "Περιγραφή:"));
    showForm.appendChild(form.desc);
    showForm.appendChild(createLabel("priority", "Προτεραιότητα:"));
    showForm.appendChild(form.priority);
    showForm.appendChild(createLabel("dueDate", "Ημερομηνία:"));
    showForm.appendChild(form.dueDate);
    showForm.appendChild(createLabel("alert", "Υπενθύμιση:"));
    showForm.appendChild(form.hasAlert);
    showForm.appendChild(
        createLabel("daysBefore", "'Υπενθύμιση' Ημέρες πρίν:")
    );
    showForm.appendChild(form.daysBefore);
    showForm.appendChild(createLabel("comments", "Σχόλια:"));
    showForm.appendChild(form.comments);
    showForm.appendChild(createLabel("isCompleted", "Ολοκληρώθηκε:"));
    showForm.appendChild(form.completed);
    showForm.appendChild(form.add);
    showForm.appendChild(form.cancel);

    details.appendChild(showForm);

    return showForm;
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
 * @summary Creates an input element in the DOM and specifies the type and id by the two string parameters,
 * Optionally specifies the text and readonly state.
 * @param {String} type - Specifies what type the input element would be.
 * @param {String} id - Specifies the id attribute of the element to be created.
 * @param {String} text - Specifies the text attribute of a button element to be created default value = empty string.
 * @param {boolean} readonly - Specifies if the element to be created is readonly.
 * @return {<input> element} Returns an input element in the DOM.
 */
function createInput(type, id, text = "", readonly = false) {
    console.debug("input attributes:", type, id);

    let element;

    if (type === "textarea") {
        element = document.createElement("textarea");
        element.setAttribute("id", id);
        element.setAttribute("placeHolder", "Your Comments Here...");
    } else {
        element = document.createElement("INPUT");
        element.setAttribute("type", type);
        element.setAttribute("id", id);
    }

    if (type === "date") {
        element.setAttribute("value", text);
        element.setAttribute("min", text);
    }

    if (type === "checkbox") {
        let checkedData = text == "" ? text : text ? true : false;
        element.setAttribute("value", true);
        if (checkedData !== "") {
            element.checked = checkedData;
        }
    }

    //TODO: refactor input creator to make all inputs so no additional settings happen inside createFullForm()
    if (type === "button") {
        console.debug("text = ", text);
        element.value = text;
        if (id === "add") {
            element.addEventListener("click", addTask);
        }
        if (id === "cancel") {
            element.addEventListener("click", cleanForm);
        }
    } else {
        if (text !== "") {
            element.value = text;
        }
    }

    if (readonly) {
        console.debug(element.id + " Is Readonly");
        if (type === "checkbox" || type === "button") {
            element.disabled = readonly;
        } else {
            element.readOnly = readonly;
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

//TODO: Add Edit function that takes pre filled input elements and enables edit functionality

/**
 * Gets the values from the form elements and passes them to the api.
 */
function addTask() {
    let task = new Object();

    //Description validation
    if (
        typeof formElements.desc.value == "undefined" ||
        formElements.desc.value === ""
    ) {
        alert("Description can not be empty");
        return;
    } else {
        task.desc = formElements.desc.value;
    }
    let priorityLevel = parseInt(formElements.priority.value);
    task.priority =
        isNaN(priorityLevel) || priorityLevel < 1 || priorityLevel > 10
            ? 10
            : priorityLevel;
    task.dueDate = formElements.dueDate.value;
    task.alert = formElements.hasAlert ? true : false;
    let reminder = parseInt(formElements.daysBefore.value);
    task.daysBefore = isNaN(reminder) || reminder < 0 ? 0 : reminder;
    task.comments = formElements.comments.value;
    task.completed = formElements.completed.checked ? true : false;

    console.debug(task);
    let httpSend = new XMLHttpRequest();

    httpSend.open("POST", url, true);
    httpSend.setRequestHeader("Content-Type", "application/json");
    httpSend.send(JSON.stringify(task));
    httpSend.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.debug(
                "response type: " + this.responseType,
                "response text: " + this.responseText
            );
            cleanForm();
            loadData();
        }
    };
}

/**
 * Cleans form and removes form elements.
 */
function cleanForm() {
    console.debug(activeForm);
    activeForm.remove();
    activeForm = null;
    formElements = null;
    console.debug(activeForm);
    addBtn.disabled = false;
}
