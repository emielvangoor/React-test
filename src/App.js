import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import "./styles.css";

import { db } from "./Firebase";
import { v4 as uuid } from "uuid";

const TodoBase = ({ todo, className }) => {
  const setChecked = (e) => {
    const completed = e.target.checked;

    db.collection("/Todos")
      .doc(e.target.value)
      .set({ ...todo, completed });
  };

  return (
    <div className={className}>
      <input
        type="checkbox"
        value={todo.id}
        onChange={setChecked}
        checked={todo.completed}
      />
      <span>{todo.title}</span>
    </div>
  );
};

const Todo = styled(TodoBase)`
  ${(props) =>
    props.todo.completed
      ? css`
          background-color: green;
          color: white;
        `
      : css`
          background-color: red;
          color: darkred;
        `};

  input[type="checkbox"] {
    margin-right: 10px;
  }
  padding: 10px;
  margin: 2px;
`;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    db.collection("/Todos").onSnapshot((snapshot) => {
      const allTodos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(allTodos);
    });
  }, []);

  const handleNewTodo = () => {
    db.collection("/Todos")
      .doc(uuid())
      .set({
        completed: false,
        title: newTodo
      })
      .then(() => {
        console.info("DONE");
        setNewTodo("");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="App">
      <label>New todo:</label>
      <input
        type="text"
        placeholder="New todo item"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <input type="button" value="Create" onClick={handleNewTodo} />
      <hr />
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
