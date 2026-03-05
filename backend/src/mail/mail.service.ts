import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailClient } from 'zeptomail';

@Injectable()
export class MailService {
  private client: SendMailClient;
  private fromAddress: string;
  private fromName: string;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('ZEPTOMAIL_URL');
    const token = this.configService.get<string>('ZEPTOMAIL_TOKEN');
    this.fromAddress = this.configService.get<string>('ZEPTOMAIL_FROM_ADDRESS') || 'noreply@deenjiggasa.info';
    this.fromName = this.configService.get<string>('ZEPTOMAIL_FROM_NAME') || 'DinJiggasa';


    this.client = new SendMailClient({ url, token });
  }

  async sendMail(to: { email: string; name: string }, subject: string, htmlBody: string) {
    try {
      await this.client.sendMail({
        from: {
          address: this.fromAddress,
          name: this.fromName,
        },
        to: [
          {
            email_address: {
              address: to.email,
              name: to.name,
            },
          },
        ],
        subject: subject,
        htmlbody: htmlBody,
      });
      return true;
    } catch (error) {
      console.error('Mail sending failed:', error);
      return false;
    }
  }

  async sendAnswerNotification(user: { email: string; name: string }, questionTitle: string, questionId: string) {
    const subject = `Answer Received: ${questionTitle}`;
    const url = `https://dinjiggasa.info/questions/${questionId}`;

    const htmlBody = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
        <div style="background-color: #006D5B; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">DinJiggasa</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Assalamu Alaikum, ${user.name}</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            A scholar has provided an answer to your question: <strong>"${questionTitle}"</strong>.
          </p>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${url}" style="background-color: #006D5B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              View Your Answer
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${url}" style="color: #006D5B;">${url}</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            This is an automated notification from DinJiggasa. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    return this.sendMail(user, subject, htmlBody);
  }

  async sendQuestionDirectionNotification(scholar: { email: string; name: string }, questionTitle: string, questionId: string) {
    const subject = `New Question Directed to You: ${questionTitle}`;
    const url = `https://dinjiggasa.info/scholar-panel/questions/${questionId}`;

    const htmlBody = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
        <div style="background-color: #006D5B; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">DinJiggasa</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Assalamu Alaikum, ${scholar.name}</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            A user has directed a question to you: <strong>"${questionTitle}"</strong>.
          </p>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${url}" style="background-color: #006D5B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              Review Question
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${url}" style="color: #006D5B;">${url}</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            This is an automated notification from DinJiggasa Scholar Panel.
          </p>
        </div>
      </div>
    `;

    return this.sendMail(scholar, subject, htmlBody);
  }

  async sendQuestionAcceptedNotification(user: { email: string; name: string }, questionTitle: string, questionId: string, scholarName: string) {
    const subject = `Question Accepted: ${questionTitle}`;
    const url = `https://dinjiggasa.info/questions/${questionId}`;

    const htmlBody = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
        <div style="background-color: #006D5B; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">DinJiggasa</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Assalamu Alaikum, ${user.name}</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Scholar <strong>${scholarName}</strong> has accepted your question: <strong>"${questionTitle}"</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            You will receive another notification once the answer is provided.
          </p>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${url}" style="background-color: #006D5B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              View Question
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${url}" style="color: #006D5B;">${url}</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            This is an automated notification from DinJiggasa. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    return this.sendMail(user, subject, htmlBody);
  }

  async sendQuestionDeclinedNotification(user: { email: string; name: string }, questionTitle: string, questionId: string, scholarName: string) {
    const subject = `Update on Your Question: ${questionTitle}`;
    const url = `https://dinjiggasa.info/questions/${questionId}`;

    const htmlBody = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
        <div style="background-color: #006D5B; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">DinJiggasa</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Assalamu Alaikum, ${user.name}</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Scholar <strong>${scholarName}</strong> has declined to answer your question: <strong>"${questionTitle}"</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Your question is still available for other scholars to answer, or you can choose to redirect it to another specific scholar.
          </p>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${url}" style="background-color: #006D5B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              View Question
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${url}" style="color: #006D5B;">${url}</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            This is an automated notification from DinJiggasa. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    return this.sendMail(user, subject, htmlBody);
  }

  async sendOTP(user: { email: string; name: string }, otp: string) {
    const subject = `${otp} is your verification code`;

    const htmlBody = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
        <div style="background-color: #006D5B; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">DinJiggasa</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">Assalamu Alaikum, ${user.name}</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for signing up for DinJiggasa. Please use the following code to verify your email address:
          </p>
          <div style="text-align: center; background-color: #f3f4f6; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <p style="font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #006D5B; margin: 0;">${otp}</p>
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
            This code will expire in 10 minutes. If you did not request this, please ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            This is an automated notification from DinJiggasa. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    return this.sendMail(user, subject, htmlBody);
  }
}
