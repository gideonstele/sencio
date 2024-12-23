import { KeyboardEvent, useState } from 'react';

import { useTodoList } from '../containers/TodoListContainer';

export const AddTodo = () => {
  const { add } = useTodoList();
  const [value, setValue] = useState('');

  const onAdd = () => {
    add(value);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAdd();
    }
  };

  return (
    <section className="AddTodo">
      <input
        className="AddTodoInput"
        placeholder="Add todo"
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button className="AddTodoButton" onClick={onAdd}>
        Add
      </button>
    </section>
  );
};
