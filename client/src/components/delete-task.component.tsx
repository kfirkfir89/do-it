import { useMutation } from 'react-query';
import { queryClient } from '../App';
import { validateResponseError } from '../utils/middleware';

const DeleteTask = ({ id }: { id: string }) => {
  const deleteTaskQuery = useMutation<unknown, Error, string>(
    async (id) => {
      try {
        return await fetch(`http://127.0.0.1:3000/api/v1/todos/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          return validateResponseError(res);
        });
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

  const deleteTaskHandler = (taskId: string) => {
    deleteTaskQuery.mutate(taskId);
  };

  return (
    <button
      type="button"
      onClick={() => deleteTaskHandler(id)}
      className="flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="h-5 w-5 fill-current"
      >
        <path d="M96,472a23.82,23.82,0,0,0,23.579,24H392.421A23.82,23.82,0,0,0,416,472V152H96Zm32-288H384V464H128Z"></path>
        <rect width="32" height="200" x="168" y="216"></rect>
        <rect width="32" height="200" x="240" y="216"></rect>
        <rect width="32" height="200" x="312" y="216"></rect>
        <path d="M328,88V40c0-13.458-9.488-24-21.6-24H205.6C193.488,16,184,26.542,184,40V88H64v32H448V88ZM216,48h80V88H216Z"></path>
      </svg>
    </button>
  );
};

export default DeleteTask;
