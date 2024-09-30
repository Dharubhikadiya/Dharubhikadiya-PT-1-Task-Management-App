export function exportTasksToCSV(tasks) {
    const csvRows = ['ID,Title,Description,Status,Due Date'];

    for (const task of tasks) {
        const row = [
            task.id,
            task.title,
            task.description,
            task.status,
            task.dueDate
        ].map(value => `"${value}"`).join(',');
        csvRows.push(row);
    }

    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
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
}

// अन्य फ़ंक्शंस को अलग से एक्सपोर्ट किया जा सकता है
export function importTasksFromCSV(data) {
    // फ़ंक्शन का कोड यहाँ...
}
