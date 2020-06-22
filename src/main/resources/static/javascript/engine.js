const radioBtn = document.querySelectorAll("input[name=sort]");
const addBtn = document.querySelector("#addBtn");
const list = document.querySelector("ul");
const details = document.querySelector("#details");
const url = "/api/v1/tasks";
const http = new XMLHttpRequest();

window.onload = loadData();

//#region Event handlers
for (let i = 0; i < radioBtn.length; i++) {
	radioBtn[i].addEventListener("click", loadData);
}

addBtn.addEventListener("click", createAddForm);
//#endregion

function loadData() {
	console.debug("call loadData");

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
			let myArr = JSON.parse(this.responseText);
			console.debug(myArr);
			fillList(myArr);
		}
	};
	http.open("GET", apiCmd, true);
	http.send();
}

function fillList(myArr) {
	console.debug("call fillList");
	for (let i = 0; i < myArr.length; i++) {
		list.appendChild(createListItem(myArr[i]));
	}
}

function createListItem(content) {
	console.debug("call createListItem");
	let item = document.createElement("li");
	item.textContent = toShortString(content);
	return item;
}

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
function createAddForm() {
	let addForm = createForm("addForm");
	let desc = createInput("text", "desc");
	let priority = createInput("text", "priority");
	let dueDate = createInput("date", "dueDate");
	dueDate.setAttribute("value", new Date().toJSON().split("T")[0]);
	let alert = createInput("checkbox", "alert");
	alert.setAttribute("value", true);
	let daysBefore = createInput("text", "daysBefore");
	let comments = document.createElement("textarea");
	comments.setAttribute("id", "comments");
	comments.setAttribute("placeHolder", "Your Comments Here...");
	let completed = createInput("checkbox", "completed");
	completed.setAttribute("value", true);
	let add = createInput("button", "add");
	let cancel = createInput("button", "cancel");

	addForm.appendChild(desc);
	addForm.appendChild(priority);
	addForm.appendChild(dueDate);
	addForm.appendChild(alert);
	addForm.appendChild(daysBefore);
	addForm.appendChild(comments);
	addForm.appendChild(completed);
	addForm.appendChild(add);
	addForm.appendChild(cancel);

	details.appendChild(addForm);
}
function createForm(id) {
	let form = document.createElement("form");
	form.setAttribute("id", id);
	return form;
}

function createInput(type, id) {
	console.debug("input attributes:", type, id);
	let element = document.createElement("INPUT");
	element.setAttribute("type", type);
	element.setAttribute("id", id);
	return element;
}
