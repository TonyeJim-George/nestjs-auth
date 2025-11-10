import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { Otp } from './otp/otp.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EmailModule, ConfigModule.forRoot({
    isGlobal: true,
  }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Otp],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    OtpModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}