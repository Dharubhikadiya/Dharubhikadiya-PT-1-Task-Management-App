import React, { useState, useEffect, useRef } from "react";
import "./TodoList.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdModeEditOutline } from "react-icons/md";
import { FaPlus, FaFileExport, FaFileImport } from "react-icons/fa6";
import Papa from 'papaparse';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    Task: "",
    Description: "",
    Status: "current",
    AssignedBy: "",
    AssignedTo: "",
    IsAssignedByAdmin: false,
    DueDate: "",
    Priority: "low",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(6);
  const [filters, setFilters] = useState({});
  const [sortCriteria, setSortCriteria] = useState({});
  const fileInputRef = useRef(null);


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
    const { name, value, type, checked } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (task.Task.trim() === "") return;

    if (editingTaskId) {
      const updatedTasks = tasks.map((t) =>
        t._id === editingTaskId ? { ...t, ...task } : t
      );
      setTasks(updatedTasks);
      setEditingTaskId(null);
      toast.success("Task updated successfully");
    } else {
      const newTask = {
        _id: Date.now().toString(),
        ...task,
      };
      setTasks([...tasks, newTask]);
      toast.success("Task added successfully");
    }

    setTask({
      Task: "",
      Description: "",
      Status: "current",
      AssignedBy: "",
      AssignedTo: "",
      IsAssignedByAdmin: false,
    });
  };

  const deleteTask = (id) => {
    const filteredTasks = tasks.filter((task) => task._id !== id);
    setTasks(filteredTasks);
    toast.success("Task deleted successfully");
  };

  const startEditing = (id) => {
    const taskToEdit = tasks.find(t => t._id === id);
    setEditingTaskId(id);
    setTask(taskToEdit);
  };

  const handleExport = () => {

    const csvData = tasks.map(task => ({
      'Task Title': task.Task,
      'Description': task.Description,
      'Due Date': task.DueDate,
      'Priority': task.Priority,
      'Status': task.Status,
      'Assigned Users': task.AssignedTo
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tasks.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast.success("Tasks exported successfully");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error("File size exceeds 1MB limit");
        return;
      }
      Papa.parse(file, {
        complete: (results) => {
          const importedTasks = [];
          const errors = [];

          results.data.forEach((row, index) => {
            if (index === 0) return; // Skip header row

            const [title, description, dueDate, priority, status, assignedTo] = row;

            // Validate required fields
            if (!title || !description) {
              errors.push(`Row ${index + 1}: Title and Description are required`);
              return;
            }

            // Validate date
            const dueDateObj = new Date(dueDate);
            if (isNaN(dueDateObj.getTime()) || dueDateObj < new Date()) {
              errors.push(`Row ${index + 1}: Invalid or past due date`);
              return;
            }

            // Validate status
            const validStatuses = ['current', 'pending', 'completed'];
            if (!validStatuses.includes(status.toLowerCase())) {
              errors.push(`Row ${index + 1}: Invalid status`);
              return;
            }

            importedTasks.push({
              _id: Date.now().toString() + index,
              Task: title,
              Description: description,
              DueDate: dueDate,
              Priority: priority,
              Status: status.toLowerCase(),
              AssignedTo: assignedTo,
            });
          });

          if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
          } else {
            setTasks(prevTasks => [...prevTasks, ...importedTasks]);
            toast.success(`Successfully imported ${importedTasks.length} tasks`);
          }
        },
        error: (error) => {
          toast.error("Error parsing CSV: " + error.message);
        },
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setSortCriteria(prevCriteria => ({
      ...prevCriteria,
      [name]: value
    }));
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === 'Priority') {
          return task[key] && task[key].toLowerCase() === value.toLowerCase();
        }
        return task[key] && task[key].toLowerCase().includes(value.toLowerCase());
      });
    })
    .sort((a, b) => {
      const sortKey = Object.keys(sortCriteria)[0];
      if (!sortKey) return 0;
      const sortOrder = sortCriteria[sortKey];
      if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredAndSortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="">

      <div className="container d-flex justify-content-between ">
        <div class="form-wrap mt-5 pt-5 me-4">
          <form id="survey-form pt-5" onSubmit={handleFormSubmit}>
            <h3 className="d-flex justify-content-start mb-4">Add Tasks</h3>
            <div class="row">
              <div className="col-md-6">
                <label className="lato-normal mb-2 d-flex justify-content-start fs-5  ">Title</label>
                <input
                  type="text"
                  name="Task"
                  value={task.Task}
                  onChange={handleInputChange}
                  placeholder="Enter task name"
                  className="form-control mb-4"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="lato-normal mb-2 d-flex justify-content-start fs-5">Description</label>
                <input
                  type="text"
                  name="Description"
                  value={task.Description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="form-control mb-4"
                />
              </div>
              <div className="col-md-6">
                <label className="lato-normal mb-2 d-flex justify-content-start fs-5">Status</label>
                <select
                  name="Status"
                  value={task.Status}
                  onChange={handleInputChange}
                  className="form-control mb-4"
                >
                  <option value="current">Current</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="lato-normal mb-2 d-flex justify-content-start fs-5">Due Date</label>
                <input
                  type="date"
                  name="DueDate"
                  value={task.DueDate}
                  onChange={handleInputChange}
                  className="form-control mb-4"
                />
              </div>
              <div className="col-md-6">
                <label className="lato-normal mb-2 d-flex justify-content-start fs-5">Assigned By</label>
                <input
                  type="text"
                  name="AssignedBy"
                  value={task.AssignedBy}
                  onChange={handleInputChange}
                  placeholder="Assigned by"
                  className="form-control mb-4"
                />
              </div>
              <div className="col-md-6">
                <label className="lato-normal mb-2 d-flex justify-content-start fs-5">Assigned To</label>
                <input
                  type="text"
                  name="AssignedTo"
                  value={task.AssignedTo}
                  onChange={handleInputChange}
                  placeholder="Assigned to"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 ">
                <div className="form-check d-flex align-items-center justify-content-start">
                  <input
                    type="checkbox"
                    name="IsAssignedByAdmin"
                    checked={task.IsAssignedByAdmin}
                    onChange={handleInputChange}
                    className="form-check-input border-1 border-dark p-1 mb-3 me-3"
                  />
                  <label className="lato-normal mb-2 d-flex justify-content-start fs-5">
                    Assigned by Admin
                  </label>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center justify-content-end">
                <button type="submit" className="btn bg-primary text-white me-2">
                  {editingTaskId ? <MdModeEditOutline /> : <FaPlus className="mb-1" />} {editingTaskId ? 'Update' : 'Add'} Task
                </button>
              </div>
            </div>


          </form>
        </div>
        <div class="form-wrap mt-5 pt-5">
          <form id="survey-form pt-5 mb-5 pb-5" onSubmit={handleFormSubmit}>
            <h3 className="d-flex justify-content-start mb-4">Filter Tasks</h3>
            <div class="row">
              <div className="col-md-6">
                <label className="lato-normal mb-2 d-flex justify-content-start fs-5">Status</label>
                <select
                  name="Status"
                  value={filters.Status || ""}
                  onChange={handleFilterChange}
                  className="form-control mb-4"
                >
                  <option value="">All</option>
                  <option value="current">Current</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {/* Priority Filter */}
              <div className="col-md-6">
                <label className="lato-normal mb-2 d-flex justify-content-start fs-5">Priority</label>
                <select
                  name="Priority"
                  value={task.Priority}
                  onChange={handleInputChange}
                  className="form-control "
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Due Date Filter */}
              <div className="col-md-6">
                <label className="lato-normal mb-2 d-flex justify-content-start fs-5">Due Date</label>
                <select
                  name="DueDate"
                  value={filters.DueDate || ""}
                  onChange={handleFilterChange}
                  className="form-control"
                >
                  <option value="">All</option>
                  <option value="today">Due Today</option>
                  <option value="week">Due This Week</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="lato-normal mb-2 d-flex justify-content-start fs-5">Assigned To</label>
                <input
                  type="text"
                  name="AssignedTo"
                  value={filters.AssignedTo || ""}
                  onChange={handleFilterChange}
                  placeholder="Assigned to"
                  className="form-control"
                />
              </div>
            </div>

          </form>
        </div>
      </div>

      {/* Export/Import Buttons */}
      <div className="mb-4 d-flex justify-content-center mt-5">
        <button onClick={handleExport} className="btn btn-success me-2">
          <FaFileExport className="mb-1" /> Export CSV
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          style={{ display: 'none' }}
          accept=".csv"
        />
        <button onClick={() => fileInputRef.current.click()} className="btn btn-primary">
          <FaFileImport className="mb-1" /> Import CSV
        </button>
      </div>



      {/* Task List */}
      <div className="container mt-5">
        <div className="row">
          {currentTasks.map((task) => (
            <div className="col-md-6 col-lg-4 mb-4" key={task._id}>

              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fs-3 d-flex justify-content-start">{task.Task}</h5>
                  <p className="card-text mt-3 d-flex justify-content-start">Description : {task.Description}</p>
                  <p className="card-text mt-3 d-flex justify-content-start">

                    Status: {task.Status} | Assigned By: {task.AssignedBy} | Assigned To: {task.AssignedTo} | Priority: {task.Priority} | Due Date: {task.DueDate}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      onClick={() => startEditing(task._id)}
                      className="btn btn-outline-secondary btn-sm me-2"
                    >
                      <MdModeEditOutline /> Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <RiDeleteBin6Fill /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: Math.ceil(filteredAndSortedTasks.length / tasksPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === Math.ceil(filteredAndSortedTasks.length / tasksPerPage) ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      <ToastContainer />
    </div>
  );
};

export default TodoList;