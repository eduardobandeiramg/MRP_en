import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors(); 
	app.useGlobalPipes(new ValidationPipe());
	const config = new DocumentBuilder()
		.setTitle('MRP')
		.setDescription('Manufacturing Resource Planning')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: ['amqp://guest:guest@localhost:5672'],
			queue: 'production_plans_queue',
			queueOptions: {
				durable: true,
			},
		},
	});

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	await app.startAllMicroservices();
	await app.listen(3000);
}
bootstrap();