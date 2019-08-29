const clc = require('cli-color');
const ora = require('ora');

const yellow = clc.xterm(3);
const green = clc.green;

const localeStringOptions = {
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: '2-digit',
    month: '2-digit',
};

function logger(namespace) {
    let startTimestamp;
    let lastTimestamp;

    const formatMessage = msg => {
        const output = typeof msg !== 'object' && msg !== null
            ? green(msg)
            : `${green('Object:')}\n${JSON.stringify(msg, null, 2)}\n`;
        const timestamp = new Date(Date.now()).toLocaleString(
            undefined,
            localeStringOptions,
        );
        return `${green(`[${namespace}] -`)} ${timestamp} ${green(output)}`
    };

    const formatTimestamp = (lastTs) => yellow(` +${Date.now() - lastTs}ms`);

    function log(message) {
        process.stdout.write('  ');
        process.stdout.write(formatMessage(message));

        if (lastTimestamp) {
            process.stdout.write(formatTimestamp(lastTimestamp));
        }
        lastTimestamp = Date.now();

        process.stdout.write(`\n`);
    }

    function spinner(message) {
        const spin = ora(formatMessage(message)).start();

        return mess => {
            const message = mess
                ? formatMessage(mess) + (lastTimestamp ? formatTimestamp(lastTimestamp) : '') : null;
            spin.succeed(message);
        };
    }

    function logStart(message) {
        startTimestamp = Date.now();
        return log(message);
    }

    function logEnd(message) {
        process.stdout.write('  ');
        process.stdout.write(formatMessage(message));

        if (startTimestamp) {
            process.stdout.write(yellow(` - Took ${Date.now() - startTimestamp}ms`));
        }
    }

    return {
        log, spinner,
        logStart, logEnd,
    };
}

module.exports = logger;
