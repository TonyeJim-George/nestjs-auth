import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OtpType } from "./enum/otp.enum";

@Entity()
export class Otp {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn()
    user: User;

    @Column()
    token: string; //hashed otp for verification or reset token for password

    @Column({ type: 'enum', enum: OtpType })
    type: OtpType;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

}