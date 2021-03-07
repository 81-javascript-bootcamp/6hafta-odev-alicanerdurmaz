import { updateTaskFromApi } from './data';
import { POMODORO_BREAK, POMODORO_WORK, POMODORO_SESSIONS } from './constans';
import { getNow, addMinutes, getTimeRemaining } from './helpers/date';
import { zeroPrefixForNumbers } from './helpers/zeroPrefixForNumbers';

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

    this.pomodoroState = {
      pomodoroCount: 0,
      session: POMODORO_SESSIONS.notStarted,
    };

    this.$taskList = document.querySelector(taskListSelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector(taskFormInput);
    this.$taskFormButton = this.$taskForm.querySelector(taskFormButton);

    this.$startButton = document.querySelector(startButtonSelector);
    this.$pauseButton = document.querySelector(pauseButtonSelector);

    this.currentTask = null;

    this.$timerEl = document.querySelector(timerSelector);
    this.currentInterval = null;
    this.currentRemaining = null;
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

      this.updateTimerTitle(
        `Working on ${this.currentTask.title} - ${zeroPrefixForNumbers(
          minutes
        )}:${zeroPrefixForNumbers(seconds)}`
      );

      if (total <= 0) {
        this.endPomdoroSession();
        this.startPomodoroBreak();
      }
    }, 1000);
  }

  createNewTimer() {
    const now = getNow();
    const endDate = addMinutes(now, POMODORO_WORK);
    this.initializeTimer(endDate);
    this.setActiveTask();
  }

  endPomdoroSession() {
    clearInterval(this.currentInterval);

    this.currentTask.completed = true;
    updateTaskFromApi(this.currentTask);

    this.pomodoroState.pomodoroCount++;
  }

  startPomodoroBreak() {
    const now = getNow();
    const breakEndDate = addMinutes(now, POMODORO_BREAK);

    this.breakInterval = setInterval(() => {
      const { total, minutes, seconds } = getTimeRemaining(breakEndDate);

      this.updateTimerTitle(
        `Chill - ${zeroPrefixForNumbers(minutes)}:${zeroPrefixForNumbers(
          seconds
        )}`
      );

      if (total <= 0) {
        clearInterval(this.breakInterval);
        this.createNewTimer();
      }
    }, 1000);
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

      this.toggleStartPauseButtons('start');
    });
  }

  handlePause() {
    this.$pauseButton.addEventListener('click', () => {
      clearInterval(this.currentInterval);
      this.toggleStartPauseButtons('pause');
    });
  }

  toggleStartPauseButtons(button) {
    if (button === 'start') {
      this.$startButton.classList.add('disabledButton');
      this.$startButton.disabled = true;

      this.$pauseButton.classList.remove('disabledButton');
      this.$pauseButton.disabled = false;
    } else {
      this.$startButton.classList.remove('disabledButton');
      this.$startButton.disabled = false;

      this.$pauseButton.classList.add('disabledButton');
      this.$pauseButton.disabled = true;
    }
  }

  updateTimerTitle(text) {
    this.$timerEl.innerHTML = text;
  }

  init() {
    useTaskResource(this);
    TaskForm(this);
    this.handleStart();
    this.handlePause();
  }
}

export default PomodoroApp;
