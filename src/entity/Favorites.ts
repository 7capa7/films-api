import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from "typeorm";
import { v4 } from "uuid";
import { Film } from "./Film";

@Entity()
export class Favorites extends BaseEntity {
  @PrimaryColumn()
  id: string = v4();

  @Column()
  name: string;

  @ManyToMany(() => Film)
  @JoinTable()
  films: Film[];
}
