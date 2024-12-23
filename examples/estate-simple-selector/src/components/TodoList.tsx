import { TodoList as TodoListType } from '../containers/TodoListContainer';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  data: TodoListType;
}

export const TodoList = ({ data }: TodoListProps) => {
  return (
    <div className="List">
      {data?.map(item => <TodoItem key={item.id} {...item} />)}
    </div>
  );
};
