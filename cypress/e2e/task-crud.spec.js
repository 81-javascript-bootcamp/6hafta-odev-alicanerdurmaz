import { TASKS_API_BASE_URL } from '../../src/constans';

describe('Task Crud', () => {
  it('can add and delete task', () => {
    const TASK_TITLE = 'Test Task';
    const MOCK_TASK = { id: '999', title: TASK_TITLE, completed: false };

    cy.intercept('GET', TASKS_API_BASE_URL, [])
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
      .wait('@getTasks')
      .get('.form-control')
      .type(TASK_TITLE)
      .get('#task-form-submit')
      .click()
      .wait('@addTask')
      .get('.row-title')
      .contains(TASK_TITLE)
      .get('.trash-icon')
      .click()
      .wait('@deleteTask')
      .get('.row-title')
      .should('not.exist');
  });
});
