import { Controller, Get, Post, Put, Delete, Body, Param, BadRequestException, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { SpaceService } from './space.service';
import { createSpaceSchema, CreateSpaceDto } from './dto/create-space.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('spaces')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @Roles('brand_owner', 'admin')
  async create(@Body() body: any, @Req() req) {
    const parsed = createSpaceSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }
    const createSpaceDto: CreateSpaceDto = parsed.data;
    return this.spaceService.create({
      ...createSpaceDto,
      owner: req.user.sub
    });
  }

  @Get()
  findAll(@Query() query: any) {
    // If type is not specified, show only active spaces
    if (!query.type) {
      query.isActive = true;
    }
    return this.spaceService.findAll(query);
  }

  @Get('my')
  @Roles('brand_owner')
  findMySpaces(@Req() req, @Query() query: any) {
    return this.spaceService.findByOwner(req.user.sub, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(id);
  }

  @Put(':id')
  @Roles('brand_owner', 'admin')
  async update(@Param('id') id: string, @Body() body: any, @Req() req) {
    const space = await this.spaceService.findOne(id);
    
    // Only allow owner or admin to update
    if (req.user.role !== 'admin' && space.owner.toString() !== req.user.sub) {
      throw new ForbiddenException('You can only update your own spaces');
    }

    const parsed = createSpaceSchema.partial().safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }
    return this.spaceService.update(id, parsed.data);
  }

  @Delete(':id')
  @Roles('brand_owner', 'admin')
  async remove(@Param('id') id: string, @Req() req) {
    const space = await this.spaceService.findOne(id);
    
    // Only allow owner or admin to delete
    if (req.user.role !== 'admin' && space.owner.toString() !== req.user.sub) {
      throw new ForbiddenException('You can only delete your own spaces');
    }

    // Soft delete for brand owners, hard delete for admins
    if (req.user.role === 'admin') {
      return this.spaceService.remove(id);
    } else {
      return this.spaceService.update(id, { isActive: false });
    }
  }
}
