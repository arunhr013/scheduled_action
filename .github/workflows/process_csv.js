const fs = require('fs');
const path = require('path');

// Define file paths
const inputFile = 'input_log.csv';
const tempFile = 'temp_input_log.csv';

// Get current time in YYYY-MM-DD HH:MM:SS format
const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

// Read the CSV file
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const lines = data.split('\n');
  const headers = lines[0].split(',');
  const jobsToRun = [];
  const rowsToKeep = [];

  // Process each row
  lines.slice(1).forEach(line => {
    const [log_entry, server, scheduleTime, file_name] = line.split(',');

    // Skip empty lines
    if (!log_entry || !server || !scheduleTime || !file_name) return;

    if (scheduleTime <= currentTime) {
      jobsToRun.push({ log_entry, server, scheduleTime, file_name });
    } else {
      rowsToKeep.push(line);
    }
  });

  // If there are jobs to run
  if (jobsToRun.length > 0) {
    console.log('Jobs to run:', jobsToRun);
    jobsToRun.forEach(job => {
      console.log(`Running job for log_entry: ${job.log_entry}`);
      // Add your custom job execution logic here, for example:
      // runJob(job);
    });
  } else {
    console.log('No jobs to run at this time.');
  }

  // Write the remaining jobs (future ones) to the temp file
  const updatedCsv = [headers.join(','), ...rowsToKeep].join('\n');
  fs.writeFile(tempFile, updatedCsv, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }

    // Replace the original file with the updated file
    fs.rename(tempFile, inputFile, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
      } else {
        console.log('CSV file updated successfully!');
      }
    });
  });
});
