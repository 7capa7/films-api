import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

@Entity()
export class Character extends BaseEntity {
  @PrimaryColumn()
  id: string = v4();

  @Column({ unique: true })
  name: string;
}
