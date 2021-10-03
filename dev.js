const spawn = require('child_process').spawn;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    spawn('yarn', ['tsc', '-w']);

    await sleep(5000);

    spawn('yarn', ['koishi', 'start', './dist/koishi.config.js'], {
        stdio: [process.stdin, process.stdout, process.stderr],
    });
})();
