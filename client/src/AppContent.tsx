/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

type Todo = {
  _id: string;
  content: string;
  done: boolean;
};

const AppContent = () => {
  const [newTask, setNewTask] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const homeQuery = useQuery<Todo[], Error>({
    queryKey: ['getAllTasks'],
    queryFn: async () => {
      const response = await fetch('http://127.0.0.1:3000/api/v1/todos');
      if (!response.ok) {
        const err = await response.json();
        throw new Error(`${err.message}`);
      }
      const res: Todo[] = await response.json();
      setTodos(res);
      return res;
    },
  });
  const { isError, error, isLoading } = homeQuery;

  const setTaskQuery = useMutation<Todo, Error>(async () => {
    const response = await fetch('http://127.0.0.1:3000/api/v1/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: newTask,
        done: false,
      }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(`${err.message}`);
    }
    const res: Todo = await response.json();
    setTodos((prev) => [...prev, res]);
    return res;
  });

  // const setTaskQuery = useMutation('addTask', () => {
  //   const res = fetch('http://127.0.0.1:3000/api/v1/todos', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       content: newTask,
  //       done: false,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((res: Todo) => setTodos([...todos, res]));
  //   return res;
  // });
  const setTaskStatus = useMutation('changeTaskStatus', (task: Todo) => {
    const res = fetch(`http://127.0.0.1:3000/api/v1/todos/${task._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: task.content,
        done: !task.done,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const index = todos.findIndex((todo) => todo._id === res._id);
        todos[index] = res;
        const newState = todos;
        setTodos(newState);
      });

    return res;
  });
  const deleteTaskQuery = useMutation('deleteTask', (id: string) => {
    const res = fetch(`http://127.0.0.1:3000/api/v1/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => setTodos([...todos.filter((task) => task._id !== id)]));
    return res;
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewTask(e.target.value);
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setTaskQuery.mutate();
    setNewTask('');
  };

  const updateTaskStatusHandler = (task: Todo) => {
    setTaskStatus.mutate(task);
  };

  const deleteTaskHandler = (taskId: string) => {
    deleteTaskQuery.mutate(taskId);
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 bg-amber-100 p-6">
      <h1 className="text-center text-4xl font-bold uppercase text-amber-600">
        todo tasks
      </h1>
      <form
        className="flex w-full flex-col items-center gap-4"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          name="newTask"
          className="input input-accent w-full max-w-sm bg-white"
          onChange={onChangeHandler}
          value={newTask}
          required
        />
        <button className="btn btn-accent">add task</button>
      </form>
      <div className="flex w-full flex-col items-center">
        {isLoading && <div>loading..</div>}
        {isError && <div>{error.message}</div>}
        <div className="flex w-full max-w-md flex-col gap-4 rounded-md bg-white  p-4 shadow-sm">
          {todos &&
            todos.map((data: Todo, index: number) => (
              <div className="flex gap-3" key={`${data.content + index}`}>
                <input
                  type="checkbox"
                  checked={data.done}
                  className="checkbox-accent checkbox checkbox-sm mt-1"
                  onChange={() => updateTaskStatusHandler(data)}
                />
                <span
                  className={`${
                    data.done ? 'line-through' : ''
                  } flex-1 text-base text-black`}
                >
                  {data.content}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTaskHandler(data._id)}
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
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AppContent;
