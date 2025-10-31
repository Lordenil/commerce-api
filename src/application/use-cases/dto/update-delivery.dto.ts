import { DeliveryStatus } from 'src/domain/entities/delivery.entity';

export class UpdateDeliveryDto {
  status: DeliveryStatus;
  eta?: Date;
}
