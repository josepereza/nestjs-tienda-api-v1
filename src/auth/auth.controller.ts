import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // 🧩 Registro de usuario
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return { message: 'Usuario registrado correctamente', user };
  }

  // 🔐 Login y obtención de token JWT
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );
    if (!user) {
      return { message: 'Credenciales inválidas' };
    }
    return this.authService.login(user);
  }

  // ✅ Verificar token y devolver datos del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Post('verify')
  verifyToken(
    @Request() req: Request & { user: { id: number; email: string } },
  ) {
    return { user: req.user, message: 'Token válido' };
  }
}
