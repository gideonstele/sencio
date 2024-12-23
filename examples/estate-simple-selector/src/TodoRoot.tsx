import { useEffect, useRef } from 'react';

import { TodoList } from './components/TodoList';
import {
  TodoListActions,
  TodoList as TodoListType,
  useAddTodo,
  useAllTodoList,
  useNotCompletedTodoList,
} from './containers/TodoListContainer';

export const TodoRoot = () => {
  const firstMount = useRef(true);

  const addTodo = useAddTodo() as unknown as TodoListActions['add'];
  const notCompletedList = useNotCompletedTodoList() as unknown as TodoListType;
  const allList = useAllTodoList() as unknown as TodoListType;

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      addTodo('Learn React');
      addTodo('Learn Redux');
      addTodo('Learn Typescript');
    }
  }, [notCompletedList, allList, addTodo]);

  return (
    <div className="FlexContainer">
      <section className="FlexItem">
        <h3>Not Completed</h3>
        <TodoList data={notCompletedList} />
      </section>
      <section className="FlexItem">
        <h3>All</h3>
        <TodoList data={allList} />
      </section>
    </div>
  );
};
