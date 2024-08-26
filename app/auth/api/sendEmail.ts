import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!, 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    return res.status(200).json({ message: 'Email sent', info });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email', details: error });
  }
};

export default sendEmail;
