import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { exportTasksToCSV, importTasksFromCSV } from '../utils/csvUtils';

function CSVImportExport() {
  const { tasks, addTask } = useTasks();
  const [importError, setImportError] = useState(null);

  const handleExport = () => {
    exportTasksToCSV(tasks);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importTasksFromCSV(file, (importedTasks, error) => {
        if (error) {
          setImportError(error);
        } else {
          importedTasks.forEach(task => addTask(task));
          setImportError(null);
        }
      });
    }
  };

  return (
    <div className="my-5">
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
      >
        Export Tasks to CSV
      </button>
      <label className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">
        Import Tasks from CSV
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="hidden"
        />
      </label>
      {importError && (
        <div className="mt-2 text-red-500">{importError}</div>
      )}
    </div>
  );
}

export default CSVImportExport;