import { 
  Controller, 
  Get, 
  Post, 
  Query, 
  HttpCode, 
  HttpStatus, 
  UseInterceptors, 
  UploadedFiles, 
  Body,
  ConflictException
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { VehiclesService } from './vehicles.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Param } from '@nestjs/common';

@Controller('vehicles') // Context URL path: http://localhost:3000/vehicles
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  // SEARCH ROUTE BLOCK

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(@Query('q') query: string) {
    return await this.vehiclesService.searchVehicles(query);
  }

  // MANAGEMENT / ONBOARDING ROUTE BLOCK
  
  @Post()
  @UseInterceptors(
    // Using AnyFilesInterceptor because the frontend appends explicit key slots 
    // (e.g. image_front, image_rear, doc_cr_front) dynamically.
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads/vehicles',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async addVehicle(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('data') dataString: string,
  ) {
    const parsedData = JSON.parse(dataString);

    // Map file storage paths directly to their specific frontend form slots
    const vehicleImages: Record<string, string> = {};
    const documentFiles: Record<string, string> = {};

    if (files && files.length > 0) {
      files.forEach(file => {
        // Force replace any Windows backslashes (\) with web standard forward slashes (/)
        const normalizedPath = file.path.replace(/\\/g, '/');

        if (file.fieldname.startsWith('image_')) {
          const slotName = file.fieldname.replace('image_', '');
          vehicleImages[slotName] = normalizedPath;
        } else if (file.fieldname.startsWith('doc_')) {
          const slotName = file.fieldname.replace('doc_', '');
          documentFiles[slotName] = normalizedPath;
        }
      });
    }

    try {
      return await this.vehiclesService.create(parsedData, vehicleImages, documentFiles);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('This vehicle registration number or chassis number already exists.');
      }
      throw error;
    }
  }

  // CUSTOMER FACING: GET BY CATEGORY
  @Get('category')
  @HttpCode(HttpStatus.OK)
  async getByCategory(@Query('name') categoryName: string) {
    return await this.vehiclesService.findByCategory(categoryName);
  }

  // CUSTOMER FACING: GET BY ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return await this.vehiclesService.findById(id);
  }
}