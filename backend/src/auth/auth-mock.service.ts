import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthMockService {
  constructor(private jwtService: JwtService) {}

  private getMockData() {
    try {
      const dataPath = path.join(__dirname, '../../data/mock-db.json');
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    } catch {
      return { users: [], clients: [] };
    }
  }

  async login(email: string, password: string) {
    const mockData = this.getMockData();
    const user = mockData.users.find((u: any) => u.email === email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      name: user.name
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
}