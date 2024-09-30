import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { exportTasksToCSV } from '../utils/csvUtils';

function parseCSV(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index].trim();
      return obj;
    }, {});
  });
}

function ImportTasks() {
  const [file, setFile] = useState(null);
  const { importTasks } = useTasks();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target.result;
      const tasks = parseCSV(csv);
      const result = importTasks(tasks);

      if (result.errors.length > 0) {
        const errorReport = result.errors.map(error => ({
          Row: error.row,
          Errors: error.errors.join(', ')
        }));
        exportTasksToCSV(errorReport, 'import_errors.csv');
        alert(`Imported ${result.success} tasks. ${result.errors.length} tasks failed. Error report downloaded.`);
      } else {
        alert(`Successfully imported ${result.success} tasks.`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleImport}>Import Tasks</button>
    </div>
  );
}

export default ImportTasks;