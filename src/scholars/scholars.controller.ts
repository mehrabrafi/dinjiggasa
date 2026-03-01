import { Controller, Get } from '@nestjs/common';
import { ScholarsService } from './scholars.service';

@Controller('scholars')
export class ScholarsController {
    constructor(private readonly scholarsService: ScholarsService) { }

    @Get()
    findAll() {
        return this.scholarsService.findAll();
    }
}
