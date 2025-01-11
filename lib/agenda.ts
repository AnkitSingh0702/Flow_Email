import Agenda from 'agenda';
import { Job } from 'agenda';
import nodemailer from 'nodemailer';

const mongoConnectionString = process.env.MONGODB_URI as string;

const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    collection: 'agendaJobs',
    options: {
      useUnifiedTopology: true
    }
  },
  maxConcurrency: 20,
  defaultConcurrency: 5
});

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
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

// Define jobs
agenda.define('send email', async (job: Job<JobData>) => {
  const { to, subject, body } = job.attrs.data;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html: body,
    });
    console.log('Email sent successfully:', { to, subject });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
});

// Start agenda
const startAgenda = async () => {
  await agenda.start();
  return agenda;
};

export default await startAgenda();
