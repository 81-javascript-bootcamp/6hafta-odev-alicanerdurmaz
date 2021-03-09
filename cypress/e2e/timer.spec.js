import {
  TASKS_API_BASE_URL,
  POMODORO_WORK,
  POMODORO_BREAK,
  POMODORO_LONG_BREAK,
} from '../../src/constans';
import { getTimeRemaining, addMinutes, getNow } from '../../src/helpers/date';
import { zeroPrefixForNumbers } from '../../src/helpers/zeroPrefixForNumbers';

const uiTimeFormat = (minutes, seconds) => {
  if (seconds <= 0) {
    seconds = 60 + seconds;
    minutes = minutes - 1;
  }
  return `${zeroPrefixForNumbers(minutes)}:${zeroPrefixForNumbers(seconds)}`;
};

describe('Timer', () => {
  const now = getNow();
  const endDate = addMinutes(now, POMODORO_WORK);
  const { total, minutes, seconds } = getTimeRemaining(endDate);

  console.log(total, minutes, seconds);
  const tasksData = [
    { id: '1', title: 'JavaScript', completed: false },
    { id: '2', title: 'TypeScript', completed: false },
    { id: '3', title: 'React', completed: false },
  ];

  beforeEach(() => {
    cy.intercept('GET', TASKS_API_BASE_URL, tasksData)
      .as('getTasks')
      .clock()
      .visit('/')
      .wait('@getTasks')
      .get('#start')
      .click();
  });

  it('timer tick works', () => {
    cy.tick(1000)
      .get('#timer')
      .contains(uiTimeFormat(minutes, seconds - 1))
      .contains(tasksData[0].title)
      .tick(1000)
      .get('#timer')
      .contains(uiTimeFormat(minutes, seconds - 2));
  });

  it('break timer works and can skips break timer ', () => {
    cy.tick(total + 1000)
      .get('#timer')
      .contains(/break/i)
      .get('#skip')
      .click()
      .tick(2000)
      .get('#timer')
      .contains(tasksData[1].title);
  });
});
