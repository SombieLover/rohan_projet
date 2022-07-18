import { Controller, Get, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JsonService } from './json.service';

@Controller('json')
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  @Get()
  root(@Res() res: Response){
    res.render('json_form', {input_1: '', input_2: ''});
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    dest: join(__dirname, '..', '..', '..', 'imported_files')
  }))
  import(@Res() res: Response, @Req() req: Request, @UploadedFile() file: Express.Multer.File){
    if(file) {
      const f = readFileSync(file.path, {encoding: 'utf-8'});
      const parsed = JSON.parse((f));
      console.log(parsed);
      res.render('json_form', {...parsed})
    }
    else {
      res.render('json_form', {...req.body});
    }
  }
}
