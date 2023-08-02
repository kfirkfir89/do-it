import { useMutation } from 'react-query';
import { Todo } from '../AppContent';
import { validateResponse } from '../utils/middleware';
import { queryClient } from '../App';

const UpdateTask = ({ task }: { task: Todo }) => {
  const setTaskStatus = useMutation<Todo, Error, Todo>(
    async (task) => {
      try {
        return await fetch(`http://127.0.0.1:3000/api/v1/todos/${task._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: task.content,
            done: !task.done,
          }),
        }).then(validateResponse);
      } catch (error) {
        throw new Error(`${(error as Error).message}`);
      }
    },
    {
      onSuccess: () => {
        const res = queryClient.invalidateQueries(['getAllTasks']);
      },
    }
  );

  const updateTaskStatusHandler = (task: Todo) => {
    setTaskStatus.mutate(task);
  };

  return (
    <input
      type="checkbox"
      checked={task.done}
      className="checkbox-accent checkbox checkbox-sm mt-1"
      onChange={() => updateTaskStatusHandler(task)}
    />
  );
};

export default UpdateTask;
