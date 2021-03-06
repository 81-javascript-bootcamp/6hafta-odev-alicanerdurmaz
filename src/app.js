import { getDataFromApi, addTaskToApi, updateTaskFromApi } from './data';
import { POMODORO_BREAK, POMODORO_WORK } from './constans';
import { getNow, addMinutes, getTimeRemaining } from './helpers/date';

import TaskItem from './components/TaskItem';
class PomodoroApp {
  constructor(options) {
    let {
      tableTbodySelector,
      taskFormSelector,
      startButtonSelector,
      timerSelector,
      pauseButtonSelector,
    } = options;
    this.data = [];
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$startButton = document.querySelector(startButtonSelector);
    this.$pauseButton = document.querySelector(pauseButtonSelector);
    this.$timerEl = document.querySelector(timerSelector);
    this.currentInterval = null;
    this.currentRemaining = null;
    this.currentTask = null;
    this.breakInterval = null;
  }

  disableTaskForm() {
    this.$taskFormInput.value = 'Ekleniyor...';
    this.$taskFormBtn.innerHTML = 'Ekleniyor...';

    this.$taskFormInput.disabled = true;
    this.$taskFormBtn.disabled = true;
  }
  enableTaskForm() {
    this.$taskFormInput.disabled = false;
    this.$taskFormBtn.disabled = false;

    this.$taskFormInput.value = '';
    this.$taskFormBtn.innerHTML = 'Add Task';
  }

  async addTask(task) {
    this.disableTaskForm();

    const newTask = await addTaskToApi(task);
    newTask && this.$tableTbody.appendChild(TaskItem(newTask));

    this.data = [...this.data, newTask];

    this.enableTaskForm();
  }

  addTaskToTable(task) {
    const newTaskItem = TaskItem(task);
    this.$tableTbody.appendChild(newTaskItem);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  async fillTasksTable() {
    const currentTasks = await getDataFromApi();
    currentTasks.forEach((task, index) => {
      this.addTaskToTable(task, index + 1);
    });

    this.data = currentTasks;
  }

  setActiveTask() {
    const allTasks = document.querySelectorAll('.task');
    allTasks.forEach(($taskItem) => ($taskItem.style.background = '#fff'));

    this.currentTask = this.data.find((task) => !task.completed);

    const targetEl = document.querySelector(
      `tr[data-taskId = 'task${this.currentTask.id}']`
    );

    targetEl.style.background = 'red';
  }

  initializeTimer(endTime) {
    this.currentInterval = setInterval(() => {
      const { total, minutes, seconds } = getTimeRemaining(endTime);

      this.currentRemaining = total;
      this.$timerEl.innerHTML = `Working on ${this.currentTask.title} - ${minutes}:${seconds}`;

      if (total <= 0) {
        clearInterval(this.currentInterval);

        this.currentTask.completed = true;
        updateTaskFromApi(this.currentTask);

        const now = getNow();
        const breakEndDate = addMinutes(now, POMODORO_BREAK);

        this.breakInterval = setInterval(() => {
          const { total, minutes, seconds } = getTimeRemaining(breakEndDate);

          this.$timerEl.innerHTML = `Chill - ${minutes}:${seconds}`;

          if (total <= 0) {
            clearInterval(this.breakInterval);
            this.createNewTimer();
          }
        }, 1000);
      }
    }, 1000);
  }

  createNewTimer() {
    const now = getNow();
    const endDate = addMinutes(now, POMODORO_WORK);
    this.initializeTimer(endDate);
    this.setActiveTask();
  }

  handleStart() {
    this.$startButton.addEventListener('click', () => {
      const now = getNow();
      if (this.currentRemaining) {
        const remaining = new Date(now.getTime() + this.currentRemaining);
        this.initializeTimer(remaining);
      } else {
        this.createNewTimer();
      }
    });
  }

  handlePause() {
    this.$pauseButton.addEventListener('click', () => {
      clearInterval(this.currentInterval);
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
    this.handleStart();
    this.handlePause();
  }
}

export default PomodoroApp;
