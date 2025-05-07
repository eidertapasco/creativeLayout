let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || {
    todo: [],
    doing: [],
    done: []
  };
  
  function saveTasks() {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }
  
  function createTaskElement(text, status, index) {
    const task = document.createElement("div");
    task.className = "task";
    task.setAttribute("draggable", true);
    task.setAttribute("data-status", status);
    task.setAttribute("data-index", index);
  
    const input = document.createElement("input");
    input.value = text;
    input.addEventListener("change", (e) => {
      tasks[status][index] = e.target.value;
      saveTasks();
    });
  
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "✖";
    delBtn.onclick = () => {
      tasks[status].splice(index, 1);
      saveTasks();
      render();
    };
  
    task.appendChild(input);
    task.appendChild(delBtn);
    task.addEventListener("dragstart", dragStart);
    return task;
  }
  
  function render() {
    ["todo", "doing", "done"].forEach((status) => {
      const container = document.getElementById(status);
      container.innerHTML = "";
      tasks[status].forEach((text, index) => {
        const taskEl = createTaskElement(text, status, index);
        container.appendChild(taskEl);
      });
    });
  }
  
  function addTask(status) {
    const text = prompt("Escribe la descripción de la tarea:");
    if (text) {
      tasks[status].push(text);
      saveTasks();
      render();
    }
  }
  
  function dragStart(e) {
    e.dataTransfer.setData("text/plain", JSON.stringify({
      status: e.target.dataset.status,
      index: e.target.dataset.index
    }));
  }
  
  document.querySelectorAll(".task-list").forEach(list => {
    list.addEventListener("dragover", e => e.preventDefault());
    list.addEventListener("drop", e => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const text = tasks[data.status][data.index];
      tasks[data.status].splice(data.index, 1);
      const targetStatus = list.id;
      tasks[targetStatus].push(text);
      saveTasks();
      render();
    });
  });
  
render();