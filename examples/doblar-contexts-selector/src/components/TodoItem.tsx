import {
  TodoItem as TodoITemType,
  useTodoList,
} from '../containers/TodoListContainer';

export const TodoItem = ({ id, text, completed }: TodoITemType) => {
  const { complete, remove } = useTodoList();

  return (
    <section className="Item">
      <section className="ItemState">{completed ? '⏱' : '✅'}</section>
      <section className="ItemText">{text}</section>
      <section className="ItemButtonGroup">
        {!completed && (
          <button className="ItemButton" onClick={() => complete(id)}>
            ✔
          </button>
        )}
        <button className="ItemButton" onClick={() => remove(id)}>
          🗑
        </button>
      </section>
    </section>
  );
};
