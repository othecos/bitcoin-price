import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Repository } from 'typeorm';


@Entity()
export class BitcoinPrice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column()
  currency!: string;

  @CreateDateColumn()
  timestamp!: Date;
} 
export type BitcoinPriceRepositoryType = Repository<BitcoinPrice>;