const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8089;
const ROOT_DIR = __dirname;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(ROOT_DIR, urlPath === '/' ? 'index.html' : urlPath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
      res.end(content);
    }
  });
});

async function runBrowserTest() {
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Server started on port ${PORT}`);

  const testUrl = `http://localhost:${PORT}/index.html#/dashboard`;
  console.log(`Launching headless Chrome to render: ${testUrl}`);

  // Run headless Chrome to dump DOM
  const chromeArgs = [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--virtual-time-budget=4000',
    '--run-all-compositor-stages-before-draw',
    '--dump-dom',
    testUrl
  ];

  const child = spawn(CHROME_PATH, chromeArgs);
  let domOutput = '';
  let errorOutput = '';

  child.stdout.on('data', data => { domOutput += data.toString(); });
  child.stderr.on('data', data => { errorOutput += data.toString(); });

  child.on('close', code => {
    server.close();
    console.log(`Headless Chrome process exited with code ${code}`);

    let passed = 0;
    let failed = 0;
    function check(cond, msg) {
      if (cond) {
        console.log(`[PASS] ${msg}`);
        passed++;
      } else {
        console.error(`[FAIL] ${msg}`);
        failed++;
      }
    }

    check(domOutput.includes('UniFlow University'), 'Rendered University title in sidebar');
    check(domOutput.includes('Total Students'), 'Rendered Total Students KPI card');
    check(domOutput.includes('28'), 'Rendered 28 metric value for Total Students');
    check(domOutput.includes('badge-departments') && domOutput.includes('>5<'), 'Sidebar Department badge shows 5');
    check(domOutput.includes('badge-courses') && domOutput.includes('>8<'), 'Sidebar Courses badge shows 8');
    check(domOutput.includes('Student Enrollment by Department'), 'Rendered Department Enrollment Chart card');
    check(domOutput.includes('Active vs Inactive Students'), 'Rendered Active vs Inactive Donut Chart card');
    check(domOutput.includes('Aarav Sharma'), 'Rendered recently enrolled student record');
    check(domOutput.includes('Audit History'), 'Rendered Local Activity Audit History section');
    check(domOutput.includes('<svg') && domOutput.includes('chart-bar-group'), 'Native SVG Bar Chart elements rendered');

    console.log(`\nBrowser Render Summary: ${passed} passed, ${failed} failed.`);
    if (failed > 0) {
      console.log('DOM excerpt:', domOutput.substring(0, 1500));
      process.exit(1);
    }
  });
}

runBrowserTest().catch(err => {
  console.error('Browser test failed:', err);
  server.close();
  process.exit(1);
});

