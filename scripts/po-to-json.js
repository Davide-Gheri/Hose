const path = require('path');
const fs = require('fs');

const {
    gettextToI18next,
} = require('i18next-conv');

const SOURCE_EXT = '.po';

const translationsPath = path.resolve(__dirname, '..', 'translations');
const jsonDestPath = path.resolve(__dirname, '..', 'backend', 'i18n');

function filterByExt(filename) {
    return path.parse(filename).ext === SOURCE_EXT;
}

function convert(language) {
    console.log(`Converting ${language}${SOURCE_EXT}`);
    const poSource = path.join(translationsPath, language + SOURCE_EXT);
    gettextToI18next(language, fs.readFileSync(poSource), {keyasareference: true})
        .then(result => {
            fs.writeFileSync(path.join(jsonDestPath, language + '.json'), result);
            console.log(`Successfully written ${language}.json`);
        }).catch(console.error);
}

fs.readdir(translationsPath, (err, files) => {
    files.filter(filterByExt).map(filename => {
        convert(filename.substring(0, SOURCE_EXT.length - 1));
    });
});
