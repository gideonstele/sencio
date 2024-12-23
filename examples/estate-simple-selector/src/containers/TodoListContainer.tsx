import { createContainer } from '@breezy/estate';
import { useImmer } from 'use-immer';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export type TodoList = TodoItem[];

export interface TodoListActions {
  add: (value: string) => void;
  remove: (id: string) => void;
  complete: (id: string) => void;
  clear: () => void;
}

export interface TodoListHook extends TodoListActions {
  list: TodoList;
}

export const [
  TodoListProvider,
  useTodoList,
  [useAllTodoList, useNotCompletedTodoList, useAddTodo],
] = createContainer<
  TodoListHook,
  { initialList?: TodoList },
  [TodoList, TodoList, TodoListActions['add']]
>(
  function useTodoListContainer({ initialList }) {
    const [list, setList] = useImmer<TodoList>(initialList || []);

    /**
     * You can also wrapped this function into `useCallback` for better performance
     */
    const add = (text: string) => {
      setList(draft => {
        draft.push({
          id: window.crypto.randomUUID(),
          text,
          completed: false,
        });
      });
    };

    const remove = (id: string) => {
      setList(draft => {
        const index = draft.findIndex(item => item.id === id);
        draft.splice(index, 1);
      });
    };

    const complete = (id: string) => {
      console.log('complete', id);

      setList(draft => {
        const index = draft.findIndex(item => item.id === id);
        draft[index].completed = !draft[index].completed;
      });
    };

    const clear = () => {
      setList([]);
    };

    return {
      list,
      add,
      remove,
      complete,
      clear,
    };
  },
  [
    (value: TodoListHook) => value.list,
    (value: TodoListHook) => value.list.filter(item => !item.completed),
    (value: TodoListHook) => value.add,
  ],
  {
    providerRequired: true,
  },
);
