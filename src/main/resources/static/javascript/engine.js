const radioBtn = document.querySelectorAll("input[name=sort]");
const list = document.querySelector("ul");
const url = "/api/v1/tasks";
const http = new XMLHttpRequest();

window.onload = loadData();

for (let i = 0; i < radioBtn.length; i++) {
  radioBtn[i].addEventListener("click", loadData);
}

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
