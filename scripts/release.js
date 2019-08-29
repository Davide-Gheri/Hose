const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs-extra');
const tar = require('tar');

const verbose = process.argv[2] && (process.argv[2] === '-v' || process.argv[2] === '--verbose');

const releaseDir = path.resolve(__dirname, '..', 'release');

const releasePath = p => path.join(releaseDir, p);
const srcPath = p => path.join('..', p);

const paths = {
    release: {
        tar: releasePath('hose.tgz'),
        app: releasePath('app'),
        gpio: releasePath('gpio'),
    },
    src: {
        frontend: srcPath('frontend'),
        backend: srcPath('backend'),
        gpio: srcPath('gpioManager'),
    },
};

const distDirname = 'build';

(async function build() {
    const { log, spinner, logStart, logEnd } = require('./logger')('Release');

    logStart('Starting Release process');
    // Clear release folder
    log('Clearing release folder of previous release');
    await clearRelease();

    // Build and move backend
    let stop = spinner('Building Backend source code');
    await buildSrc(paths.src.backend);
    stop('Backend built');
    await moveBackendToRelease();
    log('Backend files moved to release');

    // Build and move frontend
    stop = spinner('Building Frontend source code');
    await buildSrc(paths.src.frontend);
    stop('Frontend built');
    await moveFrontendToRelease();
    log('Frontend files moved to release');

    await moveGpioManagerToRelease();
    log('Gpio Manager files moved to release');

    await createTarball();
    log('Release tarball created (hose.tgz)');

    logEnd('Release process complete');
})();

function spawnAsync(command, args = [], options = {}) {
    const config = {
        stdio: verbose ? 'inherit' : 'ignore',
        shell: true,
        ...options,
    };
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, config);
        child.on('error', reject);
        child.on('close', code => {
            if (code !== 0) {
                return reject();
            }
            resolve();
        })
    })
}

async function clearRelease() {
    await fs.remove(paths.release.app)
        .then(() => fs.ensureDir(paths.release.app));
    await fs.remove(paths.release.gpio)
        .then(() => fs.ensureDir(paths.release.gpio));
    await fs.remove(paths.release.tar);
}

function buildSrc(cwd) {
    return spawnAsync('yarn build', [], {cwd});
}

function moveBackendToRelease() {
    const backendFiles = [
        distDirname,
        'client',
        'config',
        'i18n',
        'themes',
        'package.json',
        'tsconfig.json',
        'yarn.lock',
    ];

    return new Promise(async (resolve, reject) => {
        for (const file of backendFiles) {
            const fullPath = path.join(paths.src.backend, file);
            if (!fs.existsSync(fullPath)) {
                return reject(
                    new Error(`${file} not found in Backend directory`)
                );
            }
            try {
                await fs.copy(fullPath, path.join(paths.release.app, file));
            } catch (e) {
                return reject(e);
            }
        }
        resolve();
    });
}

function moveFrontendToRelease() {
    const buildDir = path.join(paths.src.frontend, distDirname);
    const releaseDestDir = path.join(paths.release.app, 'client');
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(buildDir)) {
            return reject(
                new Error('build not found in Frontend directory')
            );
        }
        if (!fs.existsSync(releaseDestDir)) {
            return reject(
                new Error('client dir not found on release directory, you need to build Backend first')
            );
        }

        return fs.copy(buildDir, releaseDestDir)
            .then(resolve)
            .catch(reject);
    });
}

function moveGpioManagerToRelease() {
    const gpioFiles = [
        'main.py',
    ];

    return new Promise(async (resolve, reject) => {
        for (const file of gpioFiles) {
            const fullPath = path.join(paths.src.gpio, file);
            if (!fs.existsSync(fullPath)) {
                return reject(
                    new Error(`${file} not found in GpioManager directory`)
                );
            }
            try {
                await fs.copy(fullPath, path.join(paths.release.gpio, file));
            } catch (e) {
                return reject(e);
            }
        }
        resolve();
    });
}

function createTarball() {
    return tar.c({
        gzip: true,
        file: paths.release.tar,
        cwd: path.join(releaseDir),
    }, ['app', 'gpio']);
}
