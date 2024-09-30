import Papa from 'papaparse';

export const exportTasksToCSV = (tasks) => {
  const csv = Papa.unparse(tasks.map(task => ({
    id: task.id,
    description: task.description,
    category: task.category,
    dueDate: task.dueDate,
    completed: task.completed ? 'Yes' : 'No',
    assignedTo: task.assignedTo,
    createdBy: task.createdBy
  })));

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
};

export const importTasksFromCSV = (file, callback) => {
  const maxSize = 1024 * 1024; // 1MB limit

  if (file.size > maxSize) {
    callback(null, 'File size exceeds the 1MB limit.');
    return;
  }

  Papa.parse(file, {
    header: true,
    complete: (results) => {
      const tasks = results.data.map(row => ({
        id: Date.now() + Math.random(),
        description: row.description,
        category: row.category,
        dueDate: row.dueDate ? new Date(row.dueDate).toISOString() : null,
        completed: row.completed.toLowerCase() === 'yes',
        assignedTo: row.assignedTo,
        createdBy: row.createdBy
      }));

      const errors = validateTasks(tasks);

      if (errors.length > 0) {
        callback(null, errors.join('\n'));
      } else {
        callback(tasks);
      }
    },
    error: (error) => {
      callback(null, `Error parsing CSV: ${error.message}`);
    }
  });
};

const validateTasks = (tasks) => {
  const errors = [];

  tasks.forEach((task, index) => {
    if (!task.description) {
      errors.push(`Row ${index + 1}: Description is required.`);
    }
    if (!task.category) {
      errors.push(`Row ${index + 1}: Category is required.`);
    }
    if (task.dueDate && isNaN(new Date(task.dueDate).getTime())) {
      errors.push(`Row ${index + 1}: Invalid due date format.`);
    }
    if (typeof task.completed !== 'boolean') {
      errors.push(`Row ${index + 1}: Completed status must be 'Yes' or 'No'.`);
    }
  });

  return errors;
};