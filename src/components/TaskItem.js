import { deleteTaskFromApi } from '../data';
import TrashIcon from './TrashIcon';

async function taskButtonClickHandler(btn, id, elementToRemove) {
  btn.disabled = true;
  btn.classList.add('spinner-grow');

  const result = await deleteTaskFromApi(id);

  btn.disabled = false;
  btn.classList.remove('spinner-grow');

  if (result) {
    document.removeEventListener('click', taskButtonClickHandler);
    elementToRemove.remove();
  }
}

const DeleteTaskButton = (id, elementToRemove) => {
  const button = document.createElement('button');

  button.innerHTML = TrashIcon();
  button.classList.add('trash-icon');

  button.addEventListener('click', () =>
    taskButtonClickHandler(button, id, elementToRemove)
  );

  return button;
};

const TaskItem = (task) => {
  const $trElement = document.createElement('tr');

  $trElement.setAttribute('data-taskId', `task${task.id}`);
  $trElement.classList.add(task.completed ? 'completedTask' : 'task');

  $trElement.innerHTML = `
  <th scope="row" class="tr-counter"></th>
  <td>
    <span class="row-title">${task.title}</span>
  </td>
  `;

  $trElement
    .querySelector('td')
    .appendChild(DeleteTaskButton(task.id, $trElement));

  return $trElement;
};

export default TaskItem;
