import { NestFactory } from '@nestjs/core';
import { AppModule } from './dist/src/app.module.js';
import { UserService } from './dist/src/user/user.service.js';

async function createTestUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  try {
    // Create a test brand owner user
    const brandOwner = await userService.register(
      'brandowner@test.com',
      'password123',
      'brand_owner',
      'Brand Owner Test'
    );
    console.log('Brand owner created:', brandOwner);
    
    // Create a test attendee user
    const attendee = await userService.register(
      'attendee@test.com',
      'password123',
      'attendee',
      'Attendee Test'
    );
    console.log('Attendee created:', attendee);
  } catch (error) {
    console.log('User might already exist:', error.message);
  }

  await app.close();
}

createTestUser();


