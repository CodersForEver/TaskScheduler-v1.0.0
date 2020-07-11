const searchTerm = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");
const clock = document.querySelector("#clock");
const radioBtn = document.querySelectorAll("input[name=sort]");
const addBtn = document.querySelector("#addBtn");
const container = document.querySelector("#container");
const listView = document.querySelector("#listView");
const list = document.querySelector("ul");
const detaiLabel = document.querySelector("#detailsLabel");
const details = document.querySelector("#details");
const buttonMenu = document.querySelector("#buttonMenu");

let activeForm = null;
let formElements = null;
let searchDiv = null;
let loadedData = null;

const url = "/api/v1/tasks";

window.onload = loadData();

//#region Event handlers
searchBtn.addEventListener("click", loadData);

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

    if (searchDiv !== null) {
        onCancelSearch();
    }

    startClock();

    while (list.lastElementChild) {
        list.removeChild(list.lastElementChild);
    }

    let command = this.value;
    if (typeof command == "undefined") {
        command = document.querySelector("input[name=sort]:checked").value;
    } else if (this.id === "searchBtn") {
        command = "/search?condition=" + searchTerm.value;
        searchDiv = createSearchCancelBtn();
        detaiLabel.style.marginLeft = 0;
        container.insertBefore(searchDiv, detaiLabel);
        searchTerm.value = "";
    }

    console.debug(radioBtn.value);
    let http = new XMLHttpRequest();
    let apiCmd = url + command;
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

function createSearchCancelBtn() {
    let div = document.createElement("div");
    div.setAttribute("id", "searchDiv");
    div.style.width = "5em";
    let cancelSearchLbl = createLabel("cancelSearch", "Search:");
    let cancelSearch = createInput("button", "cancelSearch", "X");
    div.appendChild(cancelSearchLbl);
    div.appendChild(cancelSearch);
    return div;
}

/**
 * Cancels Search terms and removes X button.
 */
function onCancelSearch() {
    container.removeChild(searchDiv);
    searchDiv = null;
    detaiLabel.style.marginLeft = "5em";
    loadData();
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
    loadedData = {
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
            loadedData[key] = content[key];
        }
        readonly = true;
    }
    console.debug("Data: ", loadedData);

    let formElement = {};

    formElement.form = createForm(formType);
    formElement.desc = createInput(
        "text",
        "desc",
        loadedData.description,
        readonly
    );
    formElement.priority = createInput(
        "text",
        "priority",
        loadedData.priority,
        readonly
    );
    let currentDate =
        loadedData.dueDate == ""
            ? new Date().toJSON().split("T")[0]
            : loadedData.dueDate;
    formElement.dueDate = createInput("date", "dueDate", currentDate, readonly);
    formElement.hasAlert = createInput(
        "checkbox",
        "alert",
        loadedData.alert,
        readonly
    );
    formElement.daysBefore = createInput(
        "text",
        "daysBefore",
        loadedData.daysBefore,
        readonly
    );
    formElement.comments = createInput(
        "textarea",
        "comments",
        loadedData.comments,
        readonly
    );
    formElement.completed = createInput(
        "checkbox",
        "isCompleted",
        loadedData.completed,
        readonly
    );

    // Check for addForm or detailForm for different buttons
    if (formType === "detailForm") {
        formElement.delete = createInput("button", "delete", "Διαγραφή");
        formElement.edit = createInput("button", "edit", "Επεξεργασία");
        formElement.save = createInput(
            "button",
            "save",
            "Αποθήκευση",
            readonly
        );
        formElement.markCompleted = createInput(
            "button",
            "markCompleted",
            "Ολοκληρώθηκε",
            loadedData.completed
        );
    } else {
        formElement.add = createInput("button", "add", "Προσθήκη", readonly);
    }

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

    if (showForm.id === "detailForm") {
        showForm.appendChild(form.delete);
        showForm.appendChild(form.edit);
    }

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

    if (showForm.id === "detailForm") {
        showForm.appendChild(form.markCompleted);
    } else {
        showForm.appendChild(form.add);
    }

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

    element = setInputType(type, id);

    if (type === "date") {
        setDateValue(element, text);
    }

    if (type === "checkbox") {
        setCheckboxState(text, element);
    }

    if (type === "button") {
        setButtonType(text, element, id);
    } else {
        if (text !== "") {
            element.value = text;
        }
    }

    if (readonly) {
        setReadonly(element, type, readonly);
    }
    return element;
}

/**
 * Set readOnly or disabled state for html elements.
 * @param {HTMLElement} element - Html element to be set.
 * @param {String} type - Type of Html Element.
 * @param {Boolean} readonly - true or false.
 */
function setReadonly(element, type, readonly) {
    console.debug(element.id + " Readonly: " + readonly);
    if (type === "checkbox" || type === "button") {
        element.disabled = readonly;
    } else {
        element.readOnly = readonly;
    }
}

/**
 * Sets checkbox state.
 * @param {String | Boolean} text - The state of the checkbox in text or Boolean.
 * @param {HTMLElement} element - The checkbox element.
 */
function setCheckboxState(text, element) {
    let checkedData = text == "" ? text : text ? true : false;
    element.setAttribute("value", true);
    if (checkedData !== "") {
        element.checked = checkedData;
    }
}

/**
 * Sets the min value and current value of a Date element.
 * @param {HTMLElement} element - The Html element of type date to set.
 * @param {String} text - The value of the date in string format.
 */
function setDateValue(element, text) {
    element.setAttribute("value", text);
    element.setAttribute("min", text);
}

/**
 * Selects the type of input to be created from an INPUT or textarea.
 * @param {String} type - String that defines the type of INPUT to be created.
 * @param {String} id - The id of the Html element.
 * @return {HTMLElement} Returns an HtmElement of type INPUT or textarea.
 */
function setInputType(type, id) {
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
    return element;
}

/**
 * Sets the buttons depending of the form type.
 * @summary Sets the buttons of the associated form type and adds the event listeners to each button.
 * @param {String} text - The Value ("Text") of the button.
 * @param {HTMLElement} element - The button HtmlElement to be set.
 * @param {String} id - The id of the button to select the associated process.
 */
function setButtonType(text, element, id) {
    console.debug("text = ", text);
    element.value = text;

    // Check for type of buttons and add associated event
    if (id === "save") {
        element.addEventListener("click", onSaveTask);
    }
    if (id === "markCompleted") {
        element.addEventListener("click", markAsCompleted);
    }
    if (id === "delete") {
        element.addEventListener("click", onDeleteTask);
    }
    if (id === "edit") {
        element.addEventListener("click", onEditTask);
    }
    if (id === "add") {
        element.addEventListener("click", addTask);
    }
    if (id === "cancel") {
        element.addEventListener("click", cleanForm);
    }
    if (id === "cancelSearch") {
        element.addEventListener("click", onCancelSearch);
        let hint = searchTerm.value;
        element.title = "Search Term: " + hint;
    }
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

/**
 * Gets the values from the form elements and passes them to the api.
 */
function addTask() {
    let task = readData();
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
 * Reads the form for data.
 * @return {Object} Returns an object with the data read from the form elements.
 */
function readData() {
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

    return task;
}

/**
 * Cleans form and removes form elements.
 */
function cleanForm() {
    console.debug(activeForm);
    activeForm.remove();
    activeForm = null;
    formElements = null;
    if (loadedData !== null) {
        loadedData = null;
    }
    console.debug(activeForm);
    addBtn.disabled = false;
}

/**
 * Callback function to enable edit mode.
 */
function onEditTask() {
    console.debug("Call Edit State");
    for (let key in formElements) {
        setReadonly(formElements[key], formElements[key].type, false);
    }
    activeForm.replaceChild(formElements.save, formElements.markCompleted);
    setReadonly(formElements.edit, "button", true);
    setReadonly(formElements.delete, "button", true);
}

/**
 * Sends edited task to the api.
 */
function onSaveTask() {
    let result = window.confirm(
        "Θέλετε σίγουρα να κάνετε αλλαγές σε αυτήν την εργασία;"
    );
    console.debug("Result = " + result);
    if (result) {
        let httpEdit = new XMLHttpRequest();

        let command = url + "/edit/" + loadedData.id;
        let task = readData();

        httpEdit.open("PUT", command, true);
        httpEdit.setRequestHeader("Content-Type", "application/json");
        httpEdit.send(JSON.stringify(task));
        httpEdit.onreadystatechange = function () {
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
}

/**
 * Deletes the currently loadedData.
 */
function onDeleteTask() {
    console.debug("Call Delete Task");
    let result = window.confirm(
        "Θέλετε σίγουρα να διαγράψετε αυτήν την εργασία;"
    );
    console.debug("Result = " + result);

    if (result) {
        console.debug(loadedData);
        let httpDel = new XMLHttpRequest();

        let command = url + "/" + loadedData.id;

        httpDel.open("DELETE", command, true);
        httpDel.setRequestHeader("Content-Type", "application/json");
        httpDel.send();
        httpDel.onreadystatechange = function () {
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
}

/**
 * Marks currently loaded task as complete.
 */
function markAsCompleted() {
    let result = window.confirm("Αυτήν η εργασία θα ολοκληρωθεί!");

    if (result) {
        console.debug(loadedData);
        let httpDel = new XMLHttpRequest();

        let command =
            url + "/markAsCompleted/" + loadedData.id + "?completed=true";

        httpDel.open("PUT", command, true);
        httpDel.setRequestHeader("Content-Type", "application/json");
        httpDel.send();
        httpDel.onreadystatechange = function () {
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
}
