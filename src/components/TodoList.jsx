import { TodoItem } from "./TodoItem";

export function TodoList({ todos, toggleTodo, deleteTodo, editTodo }) {
  return (
    <div className="bg-stone-50 mt-5 p-5 rounded-xl shadow-2xl">
      <h1 className="font-semibold font-sans tracking-widest text-sm"> To-do List:</h1>
      <ul className="list">
        {todos.length === 0 && "No to-dos yet!"}
        {todos.map((todo, id) => {
          return (
            <TodoItem
              {...todo}
              key={todo.id}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
            />
          );
        })}
      </ul>
    </div>
  );
}
