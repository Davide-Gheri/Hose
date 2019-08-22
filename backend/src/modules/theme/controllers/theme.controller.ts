import { Controller, Get, HttpException, InternalServerErrorException, Param } from '@nestjs/common';
import { ThemeService } from '../services/theme.service';

@Controller('themes')
export class ThemeController {
  constructor(
    private readonly service: ThemeService,
  ) {}

  @Get()
  index() {
    const names = this.service.getNames();
    try {
      return names.reduce((obj, fullName) => {
        const split = fullName.split('/');
        const scope = split.length === 2 ? split[0] : '_';
        const name = split.length === 2 ? split[1] : split[0];
        obj[fullName] = this.service.getTheme(scope, name);
        return obj;
      }, {});
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get('names')
  getNames() {
    return this.service.getNames();
  }

  @Get(':scope/:name')
  show(
    @Param('scope') scope: string,
    @Param('name') name: string,
  ) {
    return this.service.getTheme(scope, name);
  }
}
