import Agenda from 'agenda';
import { Job } from 'agenda';
import nodemailer from 'nodemailer';

const mongoConnectionString = process.env.MONGODB_URI as string;

// Initialize Agenda
const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    collection: 'agendaJobs',
    options: {
    },
  },
  maxConcurrency: 20,
  defaultConcurrency: 5,
});

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Set to `true` if your SMTP requires a secure connection
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface JobData {
  to?: string;
  subject?: string;
  body?: string;
  templateId?: string;
  nodeId?: string;
}

// Define Agenda job
agenda.define('send email', async (job: Job<JobData>) => {
  const { to, subject, body } = job.attrs.data || {};

  try {
    if (!to || !subject || !body) {
      throw new Error('Missing email parameters (to, subject, body)');
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html: body,
    });

    console.log('Email sent successfully:', { to, subject });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error; // Ensure Agenda retries the job if it fails
  }
});

// Start Agenda with proper handling
const startAgenda = async (): Promise<Agenda> => {
  try {
    await agenda.start();
    console.log('Agenda started successfully');
    return agenda;
  } catch (error) {
    console.error('Failed to start Agenda:', error);
    throw error;
  }
};

// Export the initialized Agenda instance
export default startAgenda();
