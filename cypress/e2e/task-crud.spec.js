import { TASKS_API_BASE_URL } from '../../src/constans';

describe('Task Crud', () => {
  const TASK_TITLE = 'Test Task';
  const MOCK_TASK = { id: '999', title: TASK_TITLE, completed: false };

  beforeEach(() => {
    cy.intercept('GET', TASKS_API_BASE_URL, [MOCK_TASK])
      .as('getTasks')
      .intercept('POST', TASKS_API_BASE_URL, {
        body: MOCK_TASK,
      })
      .as('addTask')
      .intercept('DELETE', TASKS_API_BASE_URL + '/999', {
        statusCode: 200,
        body: MOCK_TASK,
      })
      .as('deleteTask')
      .visit('/')
      .wait('@getTasks');
  });

  it('can add task', () => {
    cy.get('.form-control')
      .type(TASK_TITLE)
      .get('#task-form-submit')
      .click()
      .wait('@addTask')
      .get('.row-title')
      .contains(TASK_TITLE);
  });

  it('can delete task', () => {
    cy.get('.trash-icon')
      .click()
      .wait('@deleteTask')
      .get('.row-title')
      .should('not.exist');
  });
});
