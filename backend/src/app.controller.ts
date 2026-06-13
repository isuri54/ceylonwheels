import { Controller, Get } from '@nestjs/common';

@Controller() // inherits the global prefix, making the route: /api/v1
export class AppController {
  
  @Get() // Listens directly to the root GET request
  getSystemStatus() {
    return {
      status: 'success',
      message: 'CeylonWheels Backend API layer is fully active and accessible.',
      timestamp: new Date().toISOString()
    };
  }
}