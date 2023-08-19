import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Misc')
export class AppController {
  @Get()
  getOK(): string {
    return 'OK';
  }
}
