import { IBulkEmailDTO, IEmailDTO } from './emailDto.core';

export interface IEmailService {
  transporter: object;
  sendMail(param: IEmailDTO): Promise<any>;
  sendBulkMail(param: IBulkEmailDTO): Promise<any>;
}

export interface IEmailNotificationDTO {
  name: string;
  email: string;
  data?: any;
  confirmationToken?: any;
  userType?: string; 
}

export interface EmailNotification {
  onboardingEmailConfirmation(param: any): Promise<any>;
  onboardingCompletedEmail(param: any): Promise<any>;
  passwordRestEmail(param: any): Promise<any>;
  passwordResetConfirmationEMail(param: any): Promise<any>;
  deviceChangeEmail(param: any): Promise<any>;
  paymentStatusEmail(param: any): Promise<any>;
  transactionStatusEmail(param: any): Promise<any>;
  payoutEmail(param: any): Promise<any>;
}
