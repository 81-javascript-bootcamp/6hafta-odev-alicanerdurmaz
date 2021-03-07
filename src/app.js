import { updateTaskFromApi } from './data';
import { POMODORO_BREAK, POMODORO_WORK } from './constans';
import { getNow, addMinutes, getTimeRemaining } from './helpers/date';

import TaskForm from './components/TaskForm';
import useTaskResource from './hooks/useTaskResource';

class PomodoroApp {
  constructor(options) {
    let {
      taskListSelector,
      taskFormSelector,
      startButtonSelector,
      timerSelector,
      pauseButtonSelector,
      taskFormButton,
      taskFormInput,
    } = options;

    this.data = [];

    this.$taskList = document.querySelector(taskListSelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector(taskFormInput);
    this.$taskFormButton = this.$taskForm.querySelector(taskFormButton);

    this.$startButton = document.querySelector(startButtonSelector);
    this.$pauseButton = document.querySelector(pauseButtonSelector);

    this.$timerEl = document.querySelector(timerSelector);
    this.currentInterval = null;
    this.currentRemaining = null;
    this.currentTask = null;

    this.breakInterval = null;
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
    useTaskResource(this);
    TaskForm(this);
    this.handleStart();
    this.handlePause();
  }
}

export default PomodoroApp;
