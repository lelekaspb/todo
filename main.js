var form = document.getElementById("addForm");
var itemsList = document.getElementById("items");
var filter = document.getElementById("filter");

// Добавление новой задачи прослушка события
form.addEventListener("submit", addItem);

// Удаление элемента - прослушка клика
itemsList.addEventListener("click", removeItem);

// Фильтрация списка дел - прослушка ввода
filter.addEventListener("keyup", filterItems);

// Добавление новой задачи функция
function addItem(e) {
  // Отменяем отправку формы
  e.preventDefault();

  // Находим инпут с текстом для новой задачи
  var newItemInput = document.getElementById("newItemText");
  // Получаем текст из инпута
  var newItemText = newItemInput.value;

  // Очистим поле добавления новой задачи
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
  // Создаем элемент для новой задачи
  var newElement = document.createElement("li");
  newElement.className = "list-group-item";

  // Добавим текст в новый элемент
  var newTextNode = document.createTextNode(text);
  newElement.appendChild(newTextNode);

  // Создаем кнопку
  var deleteBtn = document.createElement("button");
  // Добавляем текст
  deleteBtn.appendChild(document.createTextNode("Удалить"));
  // Добавляем CSS class
  deleteBtn.className = "btn btn-light btn-sm float-right";
  // Добавляем data атрибут
  deleteBtn.dataset.action = "delete";

  deleteBtn.dataset.id = ID;

  // Помещаем кнопку внутрь тега li
  newElement.appendChild(deleteBtn);
  //console.log("addItem -> newElement", newElement);

  // Добавляем новую задачу в список со всеми задачами
  itemsList.prepend(newElement);
}

// Удаление элемента - ф-я
function removeItem(e) {
  if (
    e.target.hasAttribute("data-action") &&
    e.target.getAttribute("data-action") == "delete"
  ) {
    if (confirm("Удалить задачу?")) {
      e.target.parentNode.remove();

      const ID = parseInt(e.target.dataset.id);
      const index = todoStorage.content.findIndex((item) => item.id === ID);

      // delete the found entry from the localStorage
      if (index !== -1) {
        todoStorage.content.splice(index, 1);
      }
      //console.log(todoStorage);
      todoStorage.updateLocalStorage();
      console.log(todoStorage.content);
    }
  }
}

// Фильтрация списка дел ф-я
function filterItems(e) {
  // Получаем фразу для поиска и переводим ее в нижний регистр
  var searchedText = e.target.value.toLowerCase();

  // 1. Получаем списко всех задач
  var items = itemsList.querySelectorAll("li");

  // 2. Перебираем циклом все найденные теги li с задачами
  items.forEach(function (item) {
    // Получаем текст задачи из списка и переводим его в нижний регистр
    var itemText = item.firstChild.textContent.toLowerCase();

    // Проверяем вхождение искомой подстроки в текст задачи
    if (itemText.indexOf(searchedText) != -1) {
      // Если вхождение есть - показываем элемент с задачей
      item.style.display = "block";
    } else {
      // Если вхождения нет - скрываем элемент с задачей
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
    task: "Приготовить завтрак",
    id: 0,
  },
  {
    task: "Съездить на вокзал",
    id: 1,
  },
  {
    task: "Заправить авто",
    id: 2,
  },
  {
    task: "Переобуться",
    id: 3,
  },
  {
    task: "Заехать в гараж",
    id: 4,
  },
  {
    task: "Сходить в спортзал",
    id: 5,
  },
  {
    task: "Посмотреть урок по JS",
    id: 6,
  },
  {
    task: "Сделать домашку",
    id: 7,
  },
  {
    task: "Приготовить ужин",
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
