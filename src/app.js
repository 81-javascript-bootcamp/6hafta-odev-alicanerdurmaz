import { updateTaskFromApi } from './data';
import { POMODORO_BREAK, POMODORO_WORK } from './constans';
import { getNow, addMinutes, getTimeRemaining } from './helpers/date';
import { zeroPrefixForNumbers } from './helpers/zeroPrefixForNumbers';

import TaskForm from './components/TaskForm';
import TimerControl, { toggleTimerButtons } from './components/TimerControl';
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
      timerButtonsSelector,
      skipButtonSelector,
    } = options;

    this.data = [];

    this.$taskList = document.querySelector(taskListSelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector(taskFormInput);
    this.$taskFormButton = this.$taskForm.querySelector(taskFormButton);

    this.$startButton = document.querySelector(startButtonSelector);
    this.$pauseButton = document.querySelector(pauseButtonSelector);
    this.$timerButtons = document.querySelector(timerButtonsSelector);
    this.$skipButton = document.querySelector(skipButtonSelector);

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

  createNewTimer() {
    const now = getNow();
    const endDate = addMinutes(now, POMODORO_WORK);
    this.initializeTimer(endDate);
    this.setActiveTask();
  }

  initializeTimer(endTime) {
    this.currentInterval = setInterval(() => {
      toggleTimerButtons(this, true);

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

  endPomdoroSession() {
    clearInterval(this.currentInterval);
    this.currentTask.completed = true;
    updateTaskFromApi(this.currentTask);
  }

  startPomodoroBreak() {
    toggleTimerButtons(this, false);

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
        this.endBreakTimer();
      }
    }, 1000);
  }

  endBreakTimer() {
    clearInterval(this.breakInterval);
    this.createNewTimer();
  }

  updateTimerTitle(text) {
    this.$timerEl.innerHTML = text;
  }

  init() {
    useTaskResource(this);
    TaskForm(this);
    TimerControl(this);
  }
}

export default PomodoroApp;
