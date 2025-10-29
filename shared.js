// Shared utility functions for Linxdiary

function parseMarkdownStructure(md) {
  const lines = md.split('\n');
  const structure = [];
  let currentDay = null;
  let currentTask = null;
  let contentLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Day header (## Päivä X)
    if (line.startsWith('## Päivä ')) {
      // Save previous task if exists
      if (currentTask) {
        currentTask.content = contentLines.join('\n').trim();
        currentDay.tasks.push(currentTask);
      }
      
      // Start new day
      const dayTitle = line.replace(/^##\s+/, '').trim();
      currentDay = {
        title: dayTitle,
        slug: slugify(dayTitle),
        tasks: []
      };
      structure.push(currentDay);
      currentTask = null;
      contentLines = [];
    }
    // Task header (### Tehtävä:)
    else if (line.startsWith('### Tehtävä:')) {
      // Save previous task if exists
      if (currentTask) {
        currentTask.content = contentLines.join('\n').trim();
        currentDay.tasks.push(currentTask);
      }
      
      // Start new task
      const taskTitle = line.replace(/^###\s+Tehtävä:\s*/, '').trim();
      currentTask = {
        title: taskTitle,
        slug: slugify(taskTitle),
        daySlug: currentDay.slug
      };
      contentLines = [line]; // Include the task header
    }
    // Other section headers or regular content
    else if (currentTask) {
      contentLines.push(line);
    }
  }

  // Save last task
  if (currentTask && currentDay) {
    currentTask.content = contentLines.join('\n').trim();
    currentDay.tasks.push(currentTask);
  }

  return structure;
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[äå]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
