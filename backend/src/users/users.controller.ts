import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe) page?: number,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: 'active' | 'inactive',
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.usersService.findAll({
      page,
      pageSize,
      search,
      role,
      status,
      sort,
      order,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post(':id/roles/:role')
  assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('role') role: string,
    @Body('isPrimary') isPrimary?: boolean,
  ) {
    return this.usersService.assignRole(id, role, isPrimary);
  }

  @Delete(':id/roles/:role')
  removeRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('role') role: string,
  ) {
    return this.usersService.removeRole(id, role);
  }
}
