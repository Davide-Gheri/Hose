import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import get from 'lodash/get';
import set from 'lodash/set';
import merge from 'lodash/merge';
import lru from '@davidegheri/lru';

const BASE_THEME_NAME = 'base';

@Injectable()
export class ThemeService {
  private readonly baseThemePath: string = path.resolve(__dirname, '..', '..', '..', '..', 'themes');

  private readonly cache = lru(3);

  getNames() {
    return this.getThemeNames('');
  }

  getTheme(themeScope: string, themeName: string) {
    if (themeName === BASE_THEME_NAME) {
      throw new ForbiddenException();
    }
    if (themeScope === '_') {
      themeScope = '';
    }
    const partialThemePath = path.join(themeScope, themeName);

    if (this.cache.has(partialThemePath)) {
      return this.cache.get(partialThemePath);
    }

    const themePath = this.getThemeFilename(path.join(this.baseThemePath, partialThemePath));

    if (!themePath) {
      throw new NotFoundException(`Theme ${partialThemePath} does not exists`);
    }
    const baseTheme = this.getBaseTheme(themeScope);
    const theme = this.mergeThemes(baseTheme, require(themePath));
    try {
      this.replacePlaceholders(theme);
      this.cache.set(partialThemePath, theme);
      return theme;
    } catch (e) {
      throw new InternalServerErrorException(e.message + ` in theme ${partialThemePath}`);
    }
  }

  private getBaseTheme(scope: string) {
    const baseThemePath = this.getThemeFilename(path.join(this.baseThemePath, scope, BASE_THEME_NAME));
    if (!baseThemePath) {
      return {};
    }
    return require(baseThemePath);
  }

  private getThemeNames(dir: string) {
    let names = [];
    const pool = fs.readdirSync(path.join(this.baseThemePath, dir));
    pool.forEach(name => {
      const stat = fs.lstatSync(path.join(this.baseThemePath, dir, name));
      if (stat.isDirectory()) {
        names = names.concat(this.getThemeNames(path.join(dir, name)));
      } else if (stat.isFile()) {
        const parsed = path.parse(name);
        if (['.js', '.json'].includes(parsed.ext) && parsed.name !== BASE_THEME_NAME) {
          names.push(path.join(dir, parsed.name));
        }
      }
    });
    return names;
  }

  private replacePlaceholders(theme: object, partialPath?: string) {
   const objToScan = partialPath ? get(theme, partialPath) : theme;
   // Cycle to each theme keys
   Object.keys(objToScan).forEach(key => {
     const fullPath = (partialPath ? partialPath + '.' : '') + key;
     if (!['string', 'number'].includes(typeof objToScan[key])) {
       // If value is not a string or number, cycle to the new object
       this.replacePlaceholders(theme, fullPath);
     } else {
       if (typeof objToScan[key] === 'string' && objToScan[key].startsWith('$')) {
         // If value starts with "$" is a placeholder, get the value from the theme
         const keyPath = objToScan[key].slice(1);
         const value = get(theme, keyPath);
         if (!value) {
           throw new Error(`Key ${objToScan[key]} not found`);
         } else {
           // Set the new value in the theme
           set(theme, fullPath, value);
         }
       }
     }
   });
  }

  private getThemeFilename(themePath: string) {
    const parsed = path.parse(themePath);
    if (parsed.ext) {
      return fs.existsSync(themePath) ? themePath : false;
    }
    if (fs.existsSync(themePath + '.json')) {
      return themePath + '.json';
    }
    if (fs.existsSync(themePath + '.js')) {
      return themePath + '.js';
    }
    return false;
  }

  private mergeThemes(baseTheme: object, theme: object) {
    return merge({}, baseTheme, theme);
  }
}
