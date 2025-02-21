import { Entity, Column, Index } from 'typeorm';

import { UuidEntity } from '../common/database/base.entity';

@Entity()
export class TimeSeriesRawData extends UuidEntity {
  @Column({ type: 'jsonb' }) // Store entire file as JSON
  raw_data: any[];
}

@Entity()
@Index('idx_processed_data_date', ['date'])
export class TimeSeriesProcessedData extends UuidEntity {
  @Column({ type: 'timestamp', nullable: false })
  date: Date; // Standardized date field

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number; // Normalized amount field

  @Column({ type: 'varchar', length: 255, nullable: false })
  product: string; // product name

  @Column({ type: 'varchar', length: 100, nullable: false })
  category: string; // category name
}
