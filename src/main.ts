import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe, VersioningType } from '@nestjs/common'

import { AppModule } from './app.module'
import { GLOB } from './common/constants'
import { Logger } from './UsesCases/logger.service'

async function bootstrap() {
  const { CONTEXT_NAME, VERSION, BIND, PORT } = GLOB

  const simpleLogger = new Logger()

  const app = await NestFactory.create(AppModule, {
    logger: simpleLogger
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

  await app.listen(PORT, BIND, () => {
    simpleLogger.log(`BIND: ${BIND} BIND:PORT: ${PORT}`)
    simpleLogger.log(
      `Server running on ${BIND}:${PORT}/${CONTEXT_NAME}/${VERSION}`
    )
  })
}
bootstrap()
