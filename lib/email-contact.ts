'use server';

import { Resend } from 'resend';
import { ContactFormSchema } from '../schemas/contactFormSchema';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailResponse {
  success: boolean;
  error?: string;
}

export async function sendContactEmail(formData: ContactFormSchema): Promise<EmailResponse> {
  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: 'New Contact Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Message</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
            <h3 style="margin: 0 0 15px;">Sender Information</h3>
            <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <h3 style="margin: 20px 0 15px;">Message</h3>
            <p style="white-space: pre-wrap;">${formData.message}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return {
        success: false,
        error: 'Failed to send email',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
