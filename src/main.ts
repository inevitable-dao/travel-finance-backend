import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { HttpLoggingInterceptor } from './shared/interceptors/HttpLoggingInterceptor';

function setupSwaggerDocument(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setVersion('0.1')
    .addTag('Misc', 'Miscellaneous APIs')
    .addTag('User', 'User related APIs')
    .addTag('Card Package', 'Card Package related APIs')
    .addTag('Card', 'Card related APIs')
    .build();

  const options: SwaggerCustomOptions = {
    customCss: `body { background: transparent }
    .swagger-ui .topbar img { margin-top: 28px; }
    .swagger-ui .topbar { background-color: white }`,
    customSiteTitle: 'API Documentation',
  };

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, options);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new HttpLoggingInterceptor());
  app.enableCors({
    origin: [
      'https://travel-finance.vercel.app',
      'http://localhost:3000',
    ],
  });

  const port = 80;

  setupSwaggerDocument(app);

  await app.listen(port);
}
bootstrap();
