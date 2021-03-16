import { TASKS_API_BASE_URL } from '../../src/constans';

describe('Start and Pause', () => {
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
      .wait('@getTasks');
  });

  it('star and pause button works properly', () => {
    cy.isNotDisabled('#start')
      .clickTo('#start')
      .isDisabled('#start')
      .isNotDisabled('#pause')
      .clickTo('#pause')
      .isNotDisabled('#start')
      .isDisabled('#pause');
  });
});
