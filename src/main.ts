import './style.css'
import { Task, TaskCategory } from './task'

// Initialize the app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <header class="app-header">
      <div class="app-logo">FocusStack</div>
      <div class="header-controls">
        <select id="filter-category">
          <option value="ALL">All Categories</option>
          <option value="WORK">Work</option>
          <option value="STUDY">Study</option>
          <option value="PERSONAL">Personal</option>
          <option value="CODING">Coding</option>
        </select>
        <button id="focus-mode-btn">Focus Mode</button>
      </div>
    </header>
    
    <h1>Smart Daily Planner</h1>
    <p>Today: <span id="current-date">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
    
    <div class="planner-container">
      <div class="planner-section">
        <h2>Today's Tasks</h2>
        
        <div class="add-task-form">
          <div class="form-row">
            <input id="task-time" type="time" placeholder="Time">
            <input id="task-input" type="text" placeholder="Add a new task...">
          </div>
          <div class="form-row">
            <select id="task-category">
              <option value="WORK">Work</option>
              <option value="STUDY">Study</option>
              <option value="PERSONAL">Personal</option>
              <option value="CODING">Coding</option>
            </select>
            <button id="add-task-btn">Add Task</button>
          </div>
        </div>
        
        <ul id="task-list" class="task-list"></ul>
      </div>
      
      <div class="planner-section">
        <div id="focus-mode-container" class="hidden">
          <h2>Focus Mode</h2>
          <div class="pomodoro-container">
            <div id="pomodoro-timer">25:00</div>
            <div class="pomodoro-controls">
              <button id="pomodoro-start">Start</button>
              <button id="pomodoro-pause" disabled>Pause</button>
              <button id="pomodoro-reset">Reset</button>
            </div>
            <p>Current focus: <span id="current-focus-task">Select a task</span></p>
          </div>
        </div>

        <div id="normal-mode-container">
          <h2>Time Blocks</h2>
          <div id="time-blocks" class="sortable-list"></div>
          
          <h2 class="mt-4">Progress</h2>
          <div class="progress-container">
            <div class="progress-bar">
              <div id="progress-fill"></div>
            </div>
            <p>Completed: <span id="completed-count">0</span> / <span id="total-count">0</span> tasks</p>
          </div>
        </div>

        <h2 class="mt-4">Keyboard Shortcuts</h2>
        <div class="shortcuts-container">
          <p><kbd>N</kbd> - New Task</p>
          <p><kbd>F</kbd> - Toggle Focus Mode</p>
          <p><kbd>S</kbd> - Save All Tasks</p>
        </div>
      </div>
    </div>

    <div id="edit-modal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Edit Task</h2>
        <div class="edit-task-form">
          <input id="edit-task-time" type="time">
          <input id="edit-task-input" type="text">
          <select id="edit-task-category">
            <option value="WORK">Work</option>
            <option value="STUDY">Study</option>
            <option value="PERSONAL">Personal</option>
            <option value="CODING">Coding</option>
          </select>
          <div class="edit-form-buttons">
            <button id="save-edit-btn">Save</button>
            <button id="delete-task-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`

// Task storage
let tasks: Task[] = loadTasks();
let currentEditingIndex: number = -1;
let filteredCategory: string = 'ALL';
let pomodoroInterval: number | null = null;
let pomodoroMinutes: number = 25;
let pomodoroSeconds: number = 0;
let isPomodoroRunning: boolean = false;

// DOM elements
const taskInput = document.getElementById('task-input') as HTMLInputElement;
const taskTimeInput = document.getElementById('task-time') as HTMLInputElement;
const taskCategorySelect = document.getElementById('task-category') as HTMLSelectElement;
const addTaskBtn = document.getElementById('add-task-btn') as HTMLButtonElement;
const taskList = document.getElementById('task-list') as HTMLUListElement;
const timeBlocks = document.getElementById('time-blocks') as HTMLDivElement;
const completedCount = document.getElementById('completed-count') as HTMLSpanElement;
const totalCount = document.getElementById('total-count') as HTMLSpanElement;
const progressFill = document.getElementById('progress-fill') as HTMLDivElement;
const focusModeBtn = document.getElementById('focus-mode-btn') as HTMLButtonElement;
const filterCategorySelect = document.getElementById('filter-category') as HTMLSelectElement;
const editModal = document.getElementById('edit-modal') as HTMLDivElement;
const closeModal = document.querySelector('.close-modal') as HTMLSpanElement;
const editTaskTimeInput = document.getElementById('edit-task-time') as HTMLInputElement;
const editTaskInput = document.getElementById('edit-task-input') as HTMLInputElement;
const editTaskCategorySelect = document.getElementById('edit-task-category') as HTMLSelectElement;
const saveEditBtn = document.getElementById('save-edit-btn') as HTMLButtonElement;
const deleteTaskBtn = document.getElementById('delete-task-btn') as HTMLButtonElement;
const focusModeContainer = document.getElementById('focus-mode-container') as HTMLDivElement;
const normalModeContainer = document.getElementById('normal-mode-container') as HTMLDivElement;
const pomodoroTimer = document.getElementById('pomodoro-timer') as HTMLDivElement;
const pomodoroStartBtn = document.getElementById('pomodoro-start') as HTMLButtonElement;
const pomodoroPauseBtn = document.getElementById('pomodoro-pause') as HTMLButtonElement;
const pomodoroResetBtn = document.getElementById('pomodoro-reset') as HTMLButtonElement;
const currentFocusTask = document.getElementById('current-focus-task') as HTMLSpanElement;

// localStorage functions
function saveTasks() {
  localStorage.setItem('cloudpath-tasks', JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const savedTasks = localStorage.getItem('cloudpath-tasks');
  if (savedTasks) {
    try {
      const parsedTasks = JSON.parse(savedTasks);
      return parsedTasks.map((task: any) => {
        const newTask = new Task(task.time, task.description, task.category);
        newTask.completed = task.completed;
        return newTask;
      });
    } catch (e) {
      console.error('Error parsing saved tasks:', e);
      return getDefaultTasks();
    }
  } else {
    return getDefaultTasks();
  }
}

function getDefaultTasks(): Task[] {
  return [
    new Task("9:00 AM", "Work on CloudPath UI implementation", TaskCategory.CODING),
    new Task("10:30 AM", "Watch AWS CloudFormation tutorial", TaskCategory.STUDY),
    new Task("1:00 PM", "Solve 2 DSA questions", TaskCategory.STUDY),
    new Task("3:00 PM", "Update GitHub repo for project", TaskCategory.CODING),
    new Task("5:00 PM", "Read DevOps blog on CI/CD", TaskCategory.STUDY),
  ];
}

// Add a new task
function addTask() {
  const text = taskInput.value.trim();
  const time = taskTimeInput.value;
  const category = taskCategorySelect.value as TaskCategory;
  
  if (text && time) {
    const task = new Task(formatTime(time), text, category);
    tasks.push(task);
    saveTasks();
    renderTasks();
    renderTimeBlocks();
    taskInput.value = '';
    taskTimeInput.value = '';
    
    // Show notification
    showNotification('Task added successfully!');
  }
}

// Delete task
function deleteTask(index: number) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  renderTimeBlocks();
  closeEditModal();
  
  // Show notification
  showNotification('Task deleted successfully!');
}

// Format time from 24h to 12h
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

// Convert 12h time to 24h for input fields
function formatTimeFor24HourInput(timeStr: string): string {
  const [time, ampm] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (ampm === 'PM' && hours !== 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Render all tasks with filtering
function renderTasks() {
  taskList.innerHTML = '';
  
  // Apply filtering
  const tasksToRender = filteredCategory === 'ALL'
    ? tasks
    : tasks.filter(task => task.category === filteredCategory);
  
  // Sort by time
  tasksToRender.sort((a, b) => {
    return convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time);
  });
  
  tasksToRender.forEach((task, index) => {
    const actualIndex = tasks.indexOf(task); // Get the actual index in the full tasks array
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.setAttribute('draggable', 'true');
    taskItem.dataset.index = actualIndex.toString();
    
    taskItem.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${actualIndex}">
      <div class="task-time">${task.time}</div>
      <div class="task-content">
        ${task.description}
        <span class="task-category">${task.category}</span>
      </div>
      <div class="task-actions">
        <button class="focus-task-btn" data-index="${actualIndex}">Focus</button>
        <button class="edit-task-btn" data-index="${actualIndex}">Edit</button>
      </div>
    `;
    
    taskList.appendChild(taskItem);
  });
  
  updateTasksCount();
  setupDragAndDrop();
}

// Setup drag and drop
function setupDragAndDrop() {
  const draggables = document.querySelectorAll('[draggable="true"]');
  
  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e) => {
      const target = e.target as HTMLElement;
      target.classList.add('dragging');
      (e as DragEvent).dataTransfer?.setData('text/plain', target.dataset.index || '');
    });
    
    draggable.addEventListener('dragend', (e) => {
      const target = e.target as HTMLElement;
      target.classList.remove('dragging');
    });
  });
  
  taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    const dragging = document.querySelector('.dragging') as HTMLElement;
    
    if (afterElement) {
      taskList.insertBefore(dragging, afterElement);
    } else {
      taskList.appendChild(dragging);
    }
  });
  
  taskList.addEventListener('drop', (e) => {
    e.preventDefault();
    // Unused variable removed: const sourceIndex = parseInt((e as DragEvent).dataTransfer?.getData('text/plain') || '0');
    const items = Array.from(taskList.querySelectorAll('.task-item'));
    const newOrder = items.map(item => parseInt((item as HTMLElement).dataset.index || '0'));
    
    // Reorder tasks based on new UI order
    const reorderedTasks: Task[] = [];
    newOrder.forEach(index => {
      reorderedTasks.push(tasks[index]);
    });
    
    tasks = reorderedTasks;
    saveTasks();
    renderTasks();
    renderTimeBlocks();
  });
}

function getDragAfterElement(y: number) {
  const draggableElements = [...taskList.querySelectorAll('.task-item:not(.dragging)')];
  
  return draggableElements.reduce((closest: { offset: number; element: Element | null }, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}

// Convert time string to minutes for sorting
function convertTimeToMinutes(timeStr: string): number {
  const [time, ampm] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (ampm === 'PM' && hours !== 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}

// Render time blocks
function renderTimeBlocks() {
  timeBlocks.innerHTML = '';
  
  // Apply filtering for time blocks too
  const blocksToRender = filteredCategory === 'ALL'
    ? tasks
    : tasks.filter(task => task.category === filteredCategory);
  
  // Sort by time
  blocksToRender.sort((a, b) => {
    return convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time);
  });
  
  blocksToRender.forEach(task => {
    // Unused variable removed: const actualIndex = tasks.indexOf(task);
    const timeBlock = document.createElement('div');
    timeBlock.className = `time-block ${task.completed ? 'completed' : ''}`;
    
    timeBlock.innerHTML = `
      <div class="time-block-time">${task.time}</div>
      <div class="time-block-content">
        <div class="block-description">${task.description}</div>
        <div class="block-category">${task.category}</div>
      </div>
    `;
    
    timeBlocks.appendChild(timeBlock);
  });
}

// Update tasks count and progress bar
function updateTasksCount() {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;
  
  completedCount.textContent = completed.toString();
  totalCount.textContent = total.toString();
  
  // Update progress bar
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
  progressFill.style.width = `${progressPercentage}%`;
  
  // Change progress bar color based on completion
  if (progressPercentage < 30) {
    progressFill.style.backgroundColor = '#e94560';
  } else if (progressPercentage < 70) {
    progressFill.style.backgroundColor = '#ffbd39';
  } else {
    progressFill.style.backgroundColor = '#4caf50';
  }
}

// Filter tasks by category
function filterTasksByCategory() {
  filteredCategory = filterCategorySelect.value;
  renderTasks();
  renderTimeBlocks();
}

// Toggle focus mode
function toggleFocusMode() {
  document.body.classList.toggle('focus-mode');
  
  if (document.body.classList.contains('focus-mode')) {
    focusModeBtn.textContent = 'Exit Focus Mode';
    focusModeContainer.classList.remove('hidden');
    normalModeContainer.classList.add('hidden');
  } else {
    focusModeBtn.textContent = 'Focus Mode';
    focusModeContainer.classList.add('hidden');
    normalModeContainer.classList.remove('hidden');
    stopPomodoro();
  }
}

// Pomodoro timer functions
function startPomodoro() {
  if (isPomodoroRunning) return;
  
  isPomodoroRunning = true;
  pomodoroStartBtn.disabled = true;
  pomodoroPauseBtn.disabled = false;
  
  pomodoroInterval = setInterval(() => {
    if (pomodoroSeconds === 0) {
      if (pomodoroMinutes === 0) {
        // Timer completed
        clearInterval(pomodoroInterval as number);
        pomodoroInterval = null;
        isPomodoroRunning = false;
        
        // Play sound and show notification
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play();
        
        showNotification('Pomodoro completed! Take a break.');
        
        pomodoroStartBtn.disabled = false;
        pomodoroPauseBtn.disabled = true;
        return;
      }
      pomodoroMinutes--;
      pomodoroSeconds = 59;
    } else {
      pomodoroSeconds--;
    }
    
    updatePomodoroDisplay();
  }, 1000);
}

function pausePomodoro() {
  if (!isPomodoroRunning) return;
  
  clearInterval(pomodoroInterval as number);
  pomodoroInterval = null;
  isPomodoroRunning = false;
  
  pomodoroStartBtn.disabled = false;
  pomodoroPauseBtn.disabled = true;
}

function resetPomodoro() {
  clearInterval(pomodoroInterval as number);
  pomodoroInterval = null;
  isPomodoroRunning = false;
  
  pomodoroMinutes = 25;
  pomodoroSeconds = 0;
  
  updatePomodoroDisplay();
  
  pomodoroStartBtn.disabled = false;
  pomodoroPauseBtn.disabled = true;
}

function stopPomodoro() {
  clearInterval(pomodoroInterval as number);
  pomodoroInterval = null;
  isPomodoroRunning = false;
  
  pomodoroMinutes = 25;
  pomodoroSeconds = 0;
  
  updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
  pomodoroTimer.textContent = `${pomodoroMinutes.toString().padStart(2, '0')}:${pomodoroSeconds.toString().padStart(2, '0')}`;
}

// Focus on specific task
function focusOnTask(index: number) {
  toggleFocusMode();
  currentFocusTask.textContent = tasks[index].description;
}

// Show edit modal
function showEditModal(index: number) {
  currentEditingIndex = index;
  const task = tasks[index];
  
  editTaskInput.value = task.description;
  editTaskTimeInput.value = formatTimeFor24HourInput(task.time);
  editTaskCategorySelect.value = task.category;
  
  editModal.classList.add('active');
}

// Close edit modal
function closeEditModal() {
  editModal.classList.remove('active');
  currentEditingIndex = -1;
}

// Save edited task
function saveEditedTask() {
  if (currentEditingIndex === -1) return;
  
  const task = tasks[currentEditingIndex];
  task.description = editTaskInput.value;
  task.time = formatTime(editTaskTimeInput.value);
  task.category = editTaskCategorySelect.value as TaskCategory;
  
  saveTasks();
  renderTasks();
  renderTimeBlocks();
  closeEditModal();
  
  // Show notification
  showNotification('Task updated successfully!');
}

// Show notification
function showNotification(message: string) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Animate out and remove
  setTimeout(() => {
    notification.classList.remove('show');
    
    // Remove from DOM after animation
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Only respond to shortcuts if not typing in an input
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return;
  }
  
  if (e.key === 'n' || e.key === 'N') {
    e.preventDefault();
    taskInput.focus();
  } else if (e.key === 'f' || e.key === 'F') {
    e.preventDefault();
    toggleFocusMode();
  } else if (e.key === 's' || e.key === 'S') {
    e.preventDefault();
    saveTasks();
    showNotification('All tasks saved successfully!');
  }
});

// Event listeners
addTaskBtn.addEventListener('click', addTask);
filterCategorySelect.addEventListener('change', filterTasksByCategory);
focusModeBtn.addEventListener('click', toggleFocusMode);
closeModal.addEventListener('click', closeEditModal);
saveEditBtn.addEventListener('click', saveEditedTask);
deleteTaskBtn.addEventListener('click', () => deleteTask(currentEditingIndex));
pomodoroStartBtn.addEventListener('click', startPomodoro);
pomodoroPauseBtn.addEventListener('click', pausePomodoro);
pomodoroResetBtn.addEventListener('click', resetPomodoro);

taskList.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  if (target.classList.contains('task-checkbox')) {
    const index = parseInt(target.dataset.index || '0');
    tasks[index].completed = target.checked;
    saveTasks();
    renderTasks();
    renderTimeBlocks();
  }
});

taskList.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  
  if (target.classList.contains('edit-task-btn')) {
    const index = parseInt(target.dataset.index || '0');
    showEditModal(index);
  } else if (target.classList.contains('focus-task-btn')) {
    const index = parseInt(target.dataset.index || '0');
    focusOnTask(index);
  }
});

// Keyboard input in task input to auto-submit on enter
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && taskInput.value.trim() && taskTimeInput.value) {
    addTask();
  }
});

// Update current date every day at midnight
function setupDateUpdater() {
  const currentDateElement = document.getElementById('current-date') as HTMLSpanElement;
  const updateDate = () => {
    currentDateElement.textContent = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Update now and then set interval
  updateDate();
  
  // Calculate time until next midnight
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const timeUntilMidnight = tomorrow.getTime() - now.getTime();
  
  // Set timeout for first update at midnight, then interval for daily updates
  setTimeout(() => {
    updateDate();
    setInterval(updateDate, 24 * 60 * 60 * 1000); // 24 hours
  }, timeUntilMidnight);
}

// Initial setup
renderTasks();
renderTimeBlocks();
setupDateUpdater();
updatePomodoroDisplay();
