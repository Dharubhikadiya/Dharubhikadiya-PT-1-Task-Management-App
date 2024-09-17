import React, { useState, useEffect } from "react";
import "./TodoList.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdModeEditOutline } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

const TodoList = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (task.trim() === "") return;

    if (editingTaskId) {
      const updatedTasks = tasks.map((t) =>
        t.id === editingTaskId ? { ...t, text: task } : t
      );
      setTasks(updatedTasks);
      setEditingTaskId(null); 
      toast.success("Task updated successfully");
    } else {
      const newTask = {
        id: Date.now(),
        text: task,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      toast.success("Task added successfully");
    }

    setTask(""); 
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
    toast.success("Task deleted successfully");
  };

  const startEditing = (id, text) => {
    setEditingTaskId(id);
    setTask(text); 
  };

  return (
    <div className="container mt-5">
      <div id="login-box3">
        <h1 className="text-center m-0 pt-5 text-normal">Task Management</h1>

        <form
          onSubmit={handleFormSubmit}
          className="form-inline justify-content-center px-5 pt-5 pb-1"
        >
          <div className="form-group mx-sm-3 mb-2 d-flex align-items-center justify-content-between">
            <div className="todo-box">
              <input
                type="text"
                value={task}
                onChange={handleInputChange}
                placeholder="Enter a task..."
                className="mb-0 p-0"
              />
            </div>

            <button
              type="submit"
              className="btn btn-outline-success p-0"
            >
              {editingTaskId ? (
                <MdModeEditOutline className="fs-5 m-1" /> 
              ) : (
                <FaPlus className="fs-5 m-1" /> 
              )}
            </button>
          </div>
        </form>

        <ul className="list-group p-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`list-group-item ${
                task.completed ? "list-group-item-success" : ""
              }`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  {task.completed ? <del>{task.text}</del> : task.text}
                </span>
                <div>
                  <button
                    onClick={() => startEditing(task.id, task.text)}
                    className="btn btn-outline-secondary btn-sm me-2"
                  >
                    <MdModeEditOutline className="fs-5" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <RiDeleteBin6Fill className="fs-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
};

export default TodoList;
