import Agenda from 'agenda';
import { Job } from 'agenda';
import clientPromise from './mongodb';
import nodemailer from 'nodemailer';

let agenda: Agenda;

interface JobData {
  to?: string;
  subject?: string;
  body?: string;
  templateId?: string;
  nodeId?: string;
}

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

async function initAgenda() {
  const client = await clientPromise;
  const db = client.db('email-marketing-sequence');
  
  agenda = new Agenda({
    db: { address: process.env.MONGODB_URI as string, collection: 'agendaJobs' }
  });

  // Define email sending job
  agenda.define('send email', async (job: Job<JobData>) => {
    const { to, subject, body, templateId } = job.attrs.data;
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html: body,
      });
      console.log('Email sent successfully:', { to, subject, templateId });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error; // Allows Agenda to handle the failure
    }
  });

  // Define delay processing job
  agenda.define('process delay', async (job: Job<JobData>) => {
    const { nodeId } = job.attrs.data;
    console.log('Processing delay for node:', nodeId);
  });

  await agenda.start();
  return agenda;
}

// Initialize agenda when the module loads
const agendaPromise = initAgenda();

// Export a function that ensures agenda is initialized
export default await agendaPromise;
