import { AddTodo } from './components/AddTodo';
import { TodoListProvider } from './containers/TodoListContainer';
import { TodoRoot } from './TodoRoot';

function App() {
  return (
    <TodoListProvider>
      <section className="App">
        <AddTodo />
        <TodoRoot />
      </section>
    </TodoListProvider>
  );
}

export default App;
