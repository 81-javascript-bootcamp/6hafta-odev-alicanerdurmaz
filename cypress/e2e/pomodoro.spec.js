describe('Task Crud', () => {
  it('can add and delete task', () => {
    const TASK_TITLE = 'Test Task';
    const MOCK_TASK = { id: '999', title: TASK_TITLE, completed: false };

    cy.intercept('GET', 'https://603284a8a223790017acf327.mockapi.io/tasks', [])
      .as('getTasks')
      .intercept('POST', 'https://603284a8a223790017acf327.mockapi.io/tasks', {
        body: MOCK_TASK,
      })
      .as('addTask')
      .intercept(
        'DELETE',
        'https://603284a8a223790017acf327.mockapi.io/tasks/999',
        { statusCode: 200, body: MOCK_TASK }
      )
      .as('deleteTask')
      .visit('/')
      .wait('@getTasks')
      .get('.form-control')
      .type(TASK_TITLE)
      .get(':nth-child(2) > .btn')
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
