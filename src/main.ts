import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe, VersioningType } from '@nestjs/common'

import { AppModule } from './app.module'
import { GLOB } from './common/constants'
import { Logger } from './UsesCases/logger.service'

async function bootstrap() {
  const { CONTEXT_NAME, VERSION, PORT } = GLOB

  const logger = new Logger()

  const app = await NestFactory.create(AppModule, {
    logger
  })

  app.setGlobalPrefix(`${CONTEXT_NAME}/${VERSION}`)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.enableCors()
  app.enableVersioning({ type: VersioningType.URI })

  const docConfig = new DocumentBuilder()
    .setTitle('Pokemon Api')
    .setDescription('Pokemon Api References')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, docConfig)
  SwaggerModule.setup(`${CONTEXT_NAME}/${VERSION}/docs`, app, document)

  await app.listen(PORT, '0.0.0.0', async () => {
    const appUrl = await app.getUrl()
    logger.log(`Server running on ${appUrl}/${CONTEXT_NAME}/${VERSION}`)
  })
}
bootstrap()
