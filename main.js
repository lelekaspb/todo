var form = document.getElementById("addForm");
var itemsList = document.getElementById("items");
var filter = document.getElementById("filter");

// Add new task on form submission
form.addEventListener("submit", addItem);

// Delete task - listen for the click
itemsList.addEventListener("click", removeItem);

// Filter todo list - listen for input
filter.addEventListener("keyup", filterItems);

// Add new task function
function addItem(e) {
  //  cancel form submission
  e.preventDefault();

  // Find input with text for new task
  var newItemInput = document.getElementById("newItemText");

  // Get text from the input
  var newItemText = newItemInput.value;

  // Clear the input
  newItemInput.value = "";

  let ID = 0;

  // generating ID
  if (todoStorage.content.length > 0) {
    var lastIndex = todoStorage.content.length - 1;
    //console.log(todoStorage.content[lastIndex]);
    ID = todoStorage.content[lastIndex].id + 1;
  }

  createTask(newItemText, ID);

  // push new item to the todoStorage content
  todoStorage.content.push(new TodosElement(newItemText, ID));
  todoStorage.updateLocalStorage();
  //console.log(todoStorage.content);
}

function createTask(text, ID) {
  // Create element for new task
  var newElement = document.createElement("li");
  newElement.className = "list-group-item";

  // Add text to new element
  var newTextNode = document.createTextNode(text);
  newElement.appendChild(newTextNode);

  // Create button
  var deleteBtn = document.createElement("button");

  // Add text
  deleteBtn.appendChild(document.createTextNode("Delete"));

  // Add CSS class
  deleteBtn.className = "btn btn-light btn-sm float-right";

  // Add attribute
  deleteBtn.dataset.action = "delete";

  deleteBtn.dataset.id = ID;

  // Place the button into "li" element
  newElement.appendChild(deleteBtn);
  //console.log("addItem -> newElement", newElement);

  // Add new task to the todo list
  itemsList.prepend(newElement);
}

// Delete element - function
function removeItem(e) {
  if (
    e.target.hasAttribute("data-action") &&
    e.target.getAttribute("data-action") == "delete"
  ) {
    if (confirm("Do you want to delete the task?")) {
      e.target.parentNode.remove();

      const ID = parseInt(e.target.dataset.id);
      const index = todoStorage.content.findIndex((item) => item.id === ID);

      // delete the found entry from the localStorage
      if (index !== -1) {
        todoStorage.content.splice(index, 1);
      }
      todoStorage.updateLocalStorage();
      console.log(todoStorage.content);
    }
  }
}

// Filter todo list - function
function filterItems(e) {
  // Get string for search and transform it to lowercase
  var searchedText = e.target.value.toLowerCase();

  // 1. Get list of all tasks
  var items = itemsList.querySelectorAll("li");

  // 2. Loop through all found tasks
  items.forEach(function (item) {
    // Get text of a task and transform in to lowercase
    var itemText = item.firstChild.textContent.toLowerCase();
    // Check if the task contains the search text
    if (itemText.indexOf(searchedText) != -1) {
      // if it does, show the task element
      item.style.display = "block";
    } else {
      // if does not, hide the task element
      item.style.display = "none";
    }
  });
}

const TodosElement = function (task, id) {
  this.task = task;
  this.id = id;
};

const todos = [
  {
    task: "Make breakfast",
    id: 0,
  },
  {
    task: "Go to the train station",
    id: 1,
  },
  {
    task: "Refuel the car",
    id: 2,
  },
  {
    task: "Change tires",
    id: 3,
  },
  {
    task: "Visit garage",
    id: 4,
  },
  {
    task: "Do fitness exercises",
    id: 5,
  },
  {
    task: "Watch JS tutorial",
  },
  {
    task: "Do homework",
    id: 7,
  },
  {
    task: "Make dinner",
    id: 8,
  },
];

const todoStorage = {
  content: JSON.parse(localStorage.getItem("todos")) || todos,
  updateLocalStorage: function () {
    localStorage.setItem("todos", JSON.stringify(this.content));
  },
  updateDOM: function () {
    this.content.forEach(function (item) {
      createTask(item.task, item.id);
    });
  },
  init: function () {
    this.updateDOM();
    this.updateLocalStorage();
  },
};
todoStorage.init();
