import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import PomodoroApp from './app';

let pomodoroApp = new PomodoroApp({
  taskListSelector: '#table-tbody',
  taskFormSelector: '#task-form',
  taskFormButton: '#task-form > div > button',
  taskFormInput: '#task-form > div > input',
  startButtonSelector: '#start',
  pauseButtonSelector: '#pause',
  timerSelector: '#timer',
  timerButtonsSelector: '#timer-buttons',
  skipButtonSelector: '#skip',
});

pomodoroApp.init();
