const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs-extra');

const distDirname = 'build';
const releaseDir = path.resolve(__dirname, '..', 'release', 'app');

const backendDir = path.resolve(__dirname, '..', 'backend');
const frontendDir = path.resolve(__dirname, '..', 'frontend');

(async function build() {
    // Clear release folder
    await clearRelease();
    // Build and move backend
    await buildSrc(backendDir)
        .then(moveBackendToRelease);
        // .then(installBackendRuntimeDeps);
    // Build and move frontend
    await buildSrc(frontendDir)
        .then(moveFrontendToRelease);
})();

function spawnAsync(command, args = [], options = {}) {
    const config = {
        stdio: 'inherit',
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

function clearRelease() {
    return fs.remove(releaseDir)
        .then(() => fs.ensureDir(releaseDir));
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

    return new Promise((resolve, reject) => {
        for (const file of backendFiles) {
            const fullPath = path.join(backendDir, file);
            if (!fs.existsSync(fullPath)) {
                return reject(
                    new Error(`${file} not found in Backend directory`)
                );
            }
            try {
                fs.copySync(fullPath, path.join(releaseDir, file));
            } catch (e) {
                return reject(e);
            }
        }
        resolve();
    });
}

function moveFrontendToRelease() {
    const buildDir = path.join(frontendDir, distDirname);
    const releaseDestDir = path.join(releaseDir, 'client');
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

function installBackendRuntimeDeps() {
    return spawnAsync('yarn install', ['--prod'], {cwd: releaseDir});
}
