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
    cy.get('#start')
      .should('be.not.disabled')
      .click()
      .should('be.disabled')
      .get('#pause')
      .should('be.not.disabled')
      .click()
      .get('#start')
      .should('be.not.disabled');
  });
});
