export function validateTask(task, existingTasks) {
    const errors = [];
  
    if (!task.title || task.title.trim() === '') {
      errors.push('Title cannot be empty');
    }
  
    if (existingTasks.some(t => t.title === task.title)) {
      errors.push('A task with this title already exists');
    }
  
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      if (isNaN(dueDate.getTime())) {
        errors.push('Invalid due date');
      } else if (dueDate < new Date()) {
        errors.push('Due date cannot be in the past');
      }
    }
  
    // Add more validations as needed
  
    return errors;
  }