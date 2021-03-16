import { updateTaskFromApi } from './data';
import { POMODORO_BREAK, POMODORO_WORK, POMODORO_LONG_BREAK } from './constans';
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
      alarmAudioSelector,
      pomodoroCountSelector,
    } = options;

    this.data = [];
    this.pomodoroCount = 0;

    this.$taskList = document.querySelector(taskListSelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector(taskFormInput);
    this.$taskFormButton = this.$taskForm.querySelector(taskFormButton);

    this.$startButton = document.querySelector(startButtonSelector);
    this.$pauseButton = document.querySelector(pauseButtonSelector);
    this.$timerButtons = document.querySelector(timerButtonsSelector);
    this.$skipButton = document.querySelector(skipButtonSelector);
    this.$alarmAudio = document.querySelector(alarmAudioSelector);
    this.$pomodoroCountText = document.querySelector(pomodoroCountSelector);
    this.currentTask = null;

    this.$timerEl = document.querySelector(timerSelector);
    this.currentInterval = null;
    this.currentRemaining = null;
    this.breakInterval = null;
  }

  setActiveTask() {
    if (this.currentTask) {
      const currentActiveTaskElement = document.querySelector(
        `tr[data-taskId = 'task${this.currentTask.id}']`
      );
      currentActiveTaskElement.classList.remove('activeTask');
      currentActiveTaskElement.classList.add('completedTask');
    }

    this.currentTask = this.data.find((task) => !task.completed);

    const targetEl = document.querySelector(
      `tr[data-taskId = 'task${this.currentTask.id}']`
    );

    targetEl.classList.add('activeTask');
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
    this.$alarmAudio.play();

    clearInterval(this.currentInterval);
    this.currentTask.completed = true;
    updateTaskFromApi(this.currentTask);

    this.incrementPomodoroCountAndUpdateFromUi();
  }

  startPomodoroBreak() {
    toggleTimerButtons(this, false);

    const now = getNow();
    const breakTime =
      this.pomodoroCount % 4 === 0 ? POMODORO_LONG_BREAK : POMODORO_BREAK;
    const breakEndDate = addMinutes(now, breakTime);

    this.breakInterval = setInterval(() => {
      const { total, minutes, seconds } = getTimeRemaining(breakEndDate);

      this.updateTimerTitle(
        `Break - ${zeroPrefixForNumbers(minutes)}:${zeroPrefixForNumbers(
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
  incrementPomodoroCountAndUpdateFromUi() {
    this.pomodoroCount++;
    this.$pomodoroCountText.innerHTML = this.pomodoroCount;
  }

  init() {
    useTaskResource(this);
    TaskForm(this);
    TimerControl(this);
  }
}

export default PomodoroApp;
