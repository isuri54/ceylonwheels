import { Controller, Get, Post, Body, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('user-profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: any) {
    return await this.bookingsService.getUserBookingProfile(req.user.id || req.user._id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@Req() req: any, @Body() bookingDto: any) {
    return await this.bookingsService.createBooking(req.user.id || req.user._id, bookingDto);
  }
}