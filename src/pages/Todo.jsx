import "../App.css";
import { useState } from "react";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All")

  function addTodo(title) {
    setTodos((currentTodos) => {
      return [
        ...currentTodos,
        { id: crypto.randomUUID(), title, completed: false },
      ];
    });
  }

  function toggleTodo(id, completed) {
    setTodos((currentTodos) => {
      return currentTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed };
        }

        return todo;
      });
    });
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => {
      return currentTodos.filter((todo) => todo.id !== id);
    });
  }

  function editTodo(id, newTitle) {
    const editedTodo = todos.map((todo) => {
      if (id === todo.id) {
        return { ...todo, title: newTitle };
      }
      return todo;
    });
    setTodos(editedTodo);
  }

  function filterTodo() {
    switch (filter) {
      case "Active":
        return todos.filter((todo) => !todo.completed);
      case "Completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }
  
  return (
    <>
      <TodoForm addTodo={addTodo} filterTodo={filterTodo} setFilter={setFilter}/>
      <TodoList todos={filterTodo()} toggleTodo={toggleTodo} deleteTodo={deleteTodo} editTodo={editTodo} />
    </>
  );
}

export default Todo;