import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { NotificationService } from '../service/NotificationService';
import { ResponseHandler } from '../../response/handler/ResponseHandler';
import { Message } from '../../response/message/Message';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('get-last-three-by-user/:userId')
  public async getLastThreeUserNotifications(@Param('userId') userId: string) {
    const notifications = await this.notificationService.getLastThreeUserNotifications(userId);
    return ResponseHandler.generateResponse(
      notifications,
      HttpStatus.OK,
      Message.DATA_FETCHED,
    );
  }
}
