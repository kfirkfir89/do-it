import { useQuery } from 'react-query';
import { validateResponse } from './utils/middleware';
import AddTask from './components/add-task.component';
import DeleteTask from './components/delete-task.component';
import UpdateTask from './components/update-task.component';

export type Todo = {
  _id: string;
  content: string;
  done: boolean;
};

const AppContent = () => {
  const getTodos = useQuery<Todo[], Error>({
    queryKey: ['getAllTasks'],
    queryFn: async () => {
      try {
        return await fetch('http://127.0.0.1:3000/api/v1/todos').then((res) => {
          return validateResponse(res);
        });
      } catch (error) {
        throw new Error(`${error}`);
      }
    },
  });
  const { isError, error, isLoading, isSuccess, data } = getTodos;

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 bg-amber-100 p-6">
      <h1 className="text-center text-4xl font-bold uppercase text-amber-600">
        todo tasks
      </h1>
      <AddTask />
      <div className="flex w-full flex-col items-center">
        {isLoading && <div>loading..</div>}
        {isError && <div>{error.message}</div>}
        <div className="flex w-full max-w-md flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          {isSuccess &&
            data.map((data: Todo, index: number) => (
              <div className="flex gap-3" key={`${data.content + index}`}>
                <UpdateTask task={data} />
                <span
                  className={`${
                    data.done ? 'line-through' : ''
                  } flex-1 text-base text-black`}
                >
                  {data.content}
                </span>
                <DeleteTask id={data._id} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AppContent;
