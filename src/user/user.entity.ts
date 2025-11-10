import { UserAccountStatus } from "src/user/enum/user.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    // Define user entity properties here

   @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
    type: 'enum',
    enum: UserAccountStatus,
    default: UserAccountStatus.INACTIVE,
  })
    accountStatus: UserAccountStatus;
}