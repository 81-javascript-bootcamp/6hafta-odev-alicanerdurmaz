import { TASKS_API_BASE_URL } from './constans';

const fetcher = async (url, method = 'get', body = null) => {
  try {
    const response = await fetch(url, {
      ...defaultFetchHeaders,
      method,
      body,
    });

    if (response.status >= 200 || response.status <= 299)
      return await response.json();

    alert('Something went wrong, Please Try Again');
  } catch (error) {
    alert('Something went wrong, Please Try Again');
    return null;
  }
};

export const getDataFromApi = async () => {
  return await fetcher(TASKS_API_BASE_URL);
};

export const addTaskToApi = async (task) => {
  return await fetcher(TASKS_API_BASE_URL, 'post', JSON.stringify(task));
};

export const deleteTaskFromApi = async (id) => {
  return await fetcher(`${TASKS_API_BASE_URL}/${id}`, 'delete');
};

export const updateTaskFromApi = async (task) => {
  return await fetcher(
    `${TASKS_API_BASE_URL}/${task.id}`,
    'put',
    JSON.stringify(task)
  );
};

const defaultFetchHeaders = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
