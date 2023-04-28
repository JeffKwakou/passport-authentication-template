
import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendMail = async (to: string, subject: string, html: string) => {
    const msg = {
      to: to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: subject,
      html: html
    }

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
}