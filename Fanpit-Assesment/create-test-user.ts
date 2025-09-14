import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UserService } from './src/user/user.service';

async function createTestUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  try {
    // Create a test user
    const testUser = await userService.register(
      'rekha12@gmail.com',
      'password123',
      'attendee',
      'Rekha Test'
    );
    console.log('Test user created:', testUser);
  } catch (error) {
    console.log('User might already exist:', error.message);
  }

  await app.close();
}

createTestUser();



