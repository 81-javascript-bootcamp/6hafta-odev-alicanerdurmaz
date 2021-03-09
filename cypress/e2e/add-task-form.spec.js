import { TASKS_API_BASE_URL } from '../../src/constans';

describe('Add Task Form', () => {
  it('Add Task Form works properly', () => {
    const TASK_TITLE = 'Test Task';
    const MOCK_TASK = { id: '999', title: TASK_TITLE, completed: false };

    cy.intercept('GET', TASKS_API_BASE_URL, [])
      .as('getTasks')
      .intercept('POST', TASKS_API_BASE_URL, {
        body: MOCK_TASK,
        delayMs: 1000,
      })
      .as('addTask')
      .as('deleteTask')

      .visit('/')
      .wait('@getTasks')

      .typeTo('.form-control', TASK_TITLE)
      .clickTo('#task-form-submit')

      .isDisabled('.form-control')
      .isDisabled('#task-form-submit')

      .wait('@addTask')

      .isNotDisabled('.form-control')
      .isNotDisabled('#task-form-submit');
  });
});
