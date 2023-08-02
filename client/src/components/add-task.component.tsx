import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { validateResponse } from '../utils/middleware';
import { queryClient } from '../App';
import { Todo } from '../AppContent';

const AddTask = () => {
  const [newTask, setNewTask] = useState('');
  const [showError, setShowError] = useState(false);

  const setTaskQuery = useMutation<Todo, Error, string>(
    async () => {
      try {
        return await fetch('http://127.0.0.1:3000/api/v1/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newTask,
            done: false,
          }),
        }).then(validateResponse);
      } catch (error) {
        throw new Error(`Network error: ${(error as Error).message}`);
      }
    },
    {
      onSuccess: () => {
        const res = queryClient.invalidateQueries(['getAllTasks']);
      },
    }
  );

  const { isError, isLoading, error } = setTaskQuery;

  useEffect(() => {
    if (isError) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }, [isError]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewTask(e.target.value);
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setTaskQuery.mutate(newTask);
    setNewTask('');
  };

  return (
    <form
      className="flex w-full flex-col items-center gap-4"
      onSubmit={submitHandler}
    >
      <div className="flex">
        {showError && isError ? <span>{error.message}</span> : ''}
      </div>
      <input
        type="text"
        name="newTask"
        className="input input-accent w-full max-w-sm bg-white"
        onChange={onChangeHandler}
        value={newTask}
        required
      />
      <button className="btn btn-accent">
        {isLoading ? <span className="loading"></span> : <span>add task</span>}
      </button>
    </form>
  );
};

export default AddTask;
