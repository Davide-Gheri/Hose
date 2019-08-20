const path = require('path');
const scanner = require('i18next-scanner');
const vfs = require('vinyl-fs');
const sort = require('gulp-sort');

const paths = {
    src: path.resolve(__dirname, '..', 'frontend', 'src', '**/*.{ts,tsx}'),
    dest: path.resolve(__dirname, '..', 'backend'),
};

const parserOptions = {
    attr: false,
    func: {
        list: ['t'],
        extensions: ['.ts', '.tsx'],
    },
    ns: ['board', 'environment', 'gpio', 'watering', 'record', 'rule', 'error', 'common'],
    defaultNs: 'common',
    lngs: ['en', 'it'],
    resource: {
        loadPath: paths.dest + '/i18n/{{lng}}/{{ns}}.json',
        savePath: paths.dest + '/i18n/{{lng}}/{{ns}}.json',
    }
};

function parseProject() {
    vfs.src([paths.src])
        .pipe(sort())
        .pipe(scanner(parserOptions))
        .pipe(vfs.dest(paths.dest));
}

parseProject();
