const { spawn } = require('child_process');

console.log('Starting Music Collab Backend...');

const server = spawn('node', ['dist/index.js'], {
  stdio: 'inherit',
  env: { ...process.env }
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
