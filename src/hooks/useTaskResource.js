import { getDataFromApi } from '../data';
import TaskItem from '../components/TaskItem';

const useTaskResource = async (context) => {
  const currentTasks = await getDataFromApi();

  currentTasks.forEach((task) => {
    const newTaskItem = TaskItem(task);
    context.$taskList.appendChild(newTaskItem);
    context.$taskFormInput.value = '';
  });

  context.data = currentTasks;
};

export default useTaskResource;
