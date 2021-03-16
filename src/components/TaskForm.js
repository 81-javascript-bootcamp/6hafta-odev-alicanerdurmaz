import { addTaskToApi } from '../data';
import TaskItem from './TaskItem';

const TaskForm = (context) => {
  context.$taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = { title: context.$taskFormInput.value };

    disableTaskForm();
    await addTask(task);
    enableTaskForm();
  });

  const addTask = async (task) => {
    const newTask = await addTaskToApi(task);
    newTask && context.$taskList.appendChild(TaskItem(newTask));

    context.data = [...context.data, newTask];
  };

  const disableTaskForm = () => {
    context.$taskFormInput.value = 'Ekleniyor...';
    context.$taskFormButton.innerHTML = 'Ekleniyor...';

    context.$taskFormInput.disabled = true;
    context.$taskFormButton.disabled = true;
  };
  const enableTaskForm = () => {
    context.$taskFormInput.disabled = false;
    context.$taskFormButton.disabled = false;

    context.$taskFormInput.value = '';
    context.$taskFormButton.innerHTML = 'Add Task';
  };
};

export default TaskForm;
