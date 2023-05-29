import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from "typeorm";
import { Character } from "./Character";

@Entity()
export class Film extends BaseEntity {
  @PrimaryColumn()
  episode_id: number;

  @Column()
  release_date: Date;

  @Column()
  title: string;

  @ManyToMany(() => Character)
  @JoinTable()
  characters: Character[];
}
