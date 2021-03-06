import { deleteTaskFromApi } from '../data';
import TrashIcon from './TrashIcon';

const DeleteTaskButton = (id, elementToRemove) => {
  const button = document.createElement('button');

  button.innerHTML = TrashIcon();
  button.classList.add('trash-icon');

  button.addEventListener('click', async () => {
    button.disabled = true;
    button.classList.add('spinner-grow');

    const result = await deleteTaskFromApi(id);

    button.disabled = false;
    button.classList.remove('spinner-grow');

    result && elementToRemove.remove();
  });

  return button;
};

const TaskItem = (task) => {
  const $trElement = document.createElement('tr');

  $trElement.setAttribute('data-taskId', `task${task.id}`);
  $trElement.classList.add('task');

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
