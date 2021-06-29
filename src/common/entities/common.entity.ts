import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";


export class CommonEntitiy {
  @PrimaryGeneratedColumn()
  id: string;
  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @BeforeInsert()
  saltId():void {
    this.id = uuidv4();
  }
}
