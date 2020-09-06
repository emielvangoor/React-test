import React, { useEffect, useState, useRef } from "react";
import styled, { css } from "styled-components";
import "./styles.css";

import { db } from "./Firebase";
import { v4 as uuid } from "uuid";

const TodoBase = ({ id, completed, title, className }) => {
    const setChecked = (e) => {
        const completed = e.target.checked;

        db.collection("/Todos").doc(id).update({ completed });
    };

    const deleteTodo = (e) => {
        db.collection("/Todos").doc(id).delete();
    };

    return (
        <div className={className}>
            <input type="checkbox" onChange={setChecked} checked={completed} />
            <div className="title">{title}</div>
            <div className="deleteButton">
                <input type="button" value="Delete" onClick={deleteTodo} />
            </div>
        </div>
    );
};

const Todo = styled(TodoBase)`
    ${(props) =>
        props.completed
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

    .title {
        flex-grow: 1;
    }

    display: flex;

    padding: 10px;
    margin: 2px;
`;

const DeleteCompletedButton = styled.button``;

export default function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const createInputRef = useRef();

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
                setNewTodo("");
                createInputRef.current.focus();
            })
            .catch((e) => {
                console.error(e);
            });
    };

    const deleteChecked = () => {
        const batch = db.batch();

        db.collection("/Todos")
            .where("completed", "==", true)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                batch.commit();
            });
    };

    const onInputChange = (e) => {
        if (e.key === "Enter") {
            handleNewTodo();
        }
    };
    return (
        <div className="App">
            <label>New todo:</label>
            <input
                type="text"
                ref={createInputRef}
                placeholder="New todo item"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyUp={onInputChange}
            />
            <input type="button" value="Create" onClick={handleNewTodo} />
            <hr />
            Total: {todos.length} (Not completed:{" "}
            {todos.filter((todo) => todo.completed !== true).length})
            {todos.map((todo) => (
                <Todo key={todo.id} {...todo} />
            ))}
            {todos.length === 0 && <h2>All done! There are no todos :-)</h2>}
            {todos.length > 0 && (
                <DeleteCompletedButton onClick={deleteChecked}>
                    Delete completed
                </DeleteCompletedButton>
            )}
        </div>
    );
}
