const clock = document.querySelector("#clock");
const radioBtn = document.querySelectorAll("input[name=sort]");
const addBtn = document.querySelector("#addBtn");
const list = document.querySelector("ul");
const details = document.querySelector("#details");
let activeForm = null;
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
  // let addForm = createForm("addForm");
  // var desc = createInput("text", "desc");
  // var priority = createInput("text", "priority");
  // let currentDate = new Date().toJSON().split("T")[0];
  // var dueDate = createInput("date", "dueDate");
  // dueDate.setAttribute("value", currentDate);
  // dueDate.setAttribute("min", currentDate);
  // var hasAlert = createInput("checkbox", "alert");
  // hasAlert.setAttribute("value", true);
  // var daysBefore = createInput("text", "daysBefore");
  // var comments = document.createElement("textarea");
  // comments.setAttribute("id", "comments");
  // comments.setAttribute("placeHolder", "Your Comments Here...");
  // var completed = createInput("checkbox", "isCompleted");
  // completed.setAttribute("value", true);
  // let add = createInput("button", "add", "Προσθήκη");
  // let cancel = createInput("button", "cancel", "Ακύρωση");

  // //#region addForm assembly
  // addForm.appendChild(createLabel("desc", "Περιγραφή:"));
  // addForm.appendChild(desc);
  // addForm.appendChild(createLabel("priority", "Προτεραιότητα:"));
  // addForm.appendChild(priority);
  // addForm.appendChild(createLabel("dueDate", "Ημερομηνία:"));
  // addForm.appendChild(dueDate);
  // addForm.appendChild(createLabel("alert", "Υπενθύμιση:"));
  // addForm.appendChild(hasAlert);
  // addForm.appendChild(createLabel("daysBefore", "'Υπενθύμιση' Ημέρες πρίν:"));
  // addForm.appendChild(daysBefore);
  // addForm.appendChild(createLabel("comments", "Σχόλια:"));
  // addForm.appendChild(comments);
  // addForm.appendChild(createLabel("isCompleted", "Ολοκληρώθηκε:"));
  // addForm.appendChild(completed);
  // addForm.appendChild(add);
  // addForm.appendChild(cancel);

  // details.appendChild(addForm);
  // //#endregion
  // console.debug(hasAlert);
  if (activeForm !== null) {
    cleanForm();
  }
  let form = createFullForm("addForm");
  activeForm = assembleForm(form);

  //Disable add button when addForm is active
  addBtn.disabled = true;
}

//Under construction function working so far
// TODO: Add documentation after verification of function also if createInput() is refactored remove extra settings from this function
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
  formElement.dueDate = createInput("date", "dueDate");
  formElement.dueDate.setAttribute("value", currentDate);
  formElement.dueDate.setAttribute("min", currentDate);
  formElement.dueDate.readOnly = readonly;
  let alertData = data.alert == "" ? data.alert : data.alert ? true : false;
  formElement.hasAlert = createInput("checkbox", "alert");
  formElement.hasAlert.setAttribute("value", true);
  if (alertData !== "") {
    formElement.hasAlert.checked = alertData;
  }
  formElement.hasAlert.disabled = readonly;
  formElement.daysBefore = createInput(
    "text",
    "daysBefore",
    data.daysBefore,
    readonly
  );
  formElement.comments = document.createElement("textarea");
  formElement.comments.setAttribute("id", "comments");
  formElement.comments.setAttribute("placeHolder", "Your Comments Here...");
  formElement.comments.value = data.comments;
  formElement.comments.readOnly = readonly;
  let completedData =
    data.completed == "" ? data.completed : data.completed ? true : false;
  formElement.completed = createInput("checkbox", "isCompleted");
  formElement.completed.setAttribute("value", true);
  if (completedData !== "") {
    formElement.completed.checked = completedData;
  }
  formElement.completed.disabled = readonly;

  //TODO: Add check for addForm od detailForm for different buttons

  formElement.add = createInput("button", "add", "Προσθήκη", readonly);
  formElement.cancel = createInput("button", "cancel", "Ακύρωση");

  return formElement;
}

//Under construction function working so far
// TODO: Add documentation after verification of function also probably return formElements object to global scope
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
      let form = createFullForm("detailForm", dataObj);
      activeForm = assembleForm(form, dataObj);
    }
  };
  let apiPath = url + "/" + parseInt(this.id);
  httpFind.open("GET", apiPath, true);
  httpFind.setRequestHeader("Content-Type", "application/json");
  httpFind.send();
}

//Under construction Working so far
// TODO: Add documentation after verification of function
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
  showForm.appendChild(createLabel("daysBefore", "'Υπενθύμιση' Ημέρες πρίν:"));
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

//TODO: Rewrite createInput() Documentation to fit function

/**
 * Creates an input element in the DOM.
 * @summary Creates an input element in the DOM and specifies the type and id by the two string parameters
 * and optionally specifies the text of a button.
 * @param {String} type - Specifies what type the input element would be.
 * @param {String} id - Specifies the id attribute of the element to be created.
 * @param {String} text - Specifies the text attribute of a button element to be created default value = empty string.
 * @return {<input> element} Returns an input element in the DOM.
 */
function createInput(type, id, text = "", readonly = false) {
  console.debug("input attributes:", type, id);
  let element = document.createElement("INPUT");
  element.setAttribute("type", type);
  element.setAttribute("id", id);

  if (readonly) {
    console.debug(element.id + " Is Readonly");
    if (type !== "checkbox" || type !== "button") {
      element.readOnly = readonly;
    } else {
      element.disabled = readonly;
    }
  }
  //TODO: refactor input creator to make all inputs so no additional settings happen inside createFullForm()
  if (type === "button") {
    console.debug("text = ", text);
    element.value = text;
    if (id === "add") {
      //Test expression
      element.disabled = readonly;
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

//TODO: addTask works but doesn't make sense since the element variables dont exist in the scope also finish documentation after that

/**
 * Gets the values from the form elements.
 * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
 * @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
 * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
 */
function addTask() {
  let task = new Object();

  //Description validation
  if (typeof desc.value == "undefined" || desc.value === "") {
    alert("Description can not be empty");
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
  console.debug(activeForm);
  addBtn.disabled = false;
}
