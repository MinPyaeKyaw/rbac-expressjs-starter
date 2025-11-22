import dotenv from 'dotenv';
import { base64Encode } from '../utils/common';
import apiClient from '../api-client';
dotenv.config();

const encodedToken = base64Encode(
  `${process.env.SMS_API_KEY}:${process.env.SMS_API_SECRET}`
);

export const sendSMS = async (phones: string, message: string) => {
  return apiClient.post(
    'https://v3.smspoh.com/api/rest/send/bulk',
    {
      messages: [
        {
          to: phones,
          message,
          from: process.env.SMS_SENDER_ID,
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${encodedToken}`,
      },
    }
  );
};

export const sendBulkSMS = async (phones: string[], message: string) => {
  return apiClient.post(
    'https://v3.smspoh.com/api/rest/send/bulk',
    {
      messages: [
        {
          to: phones,
          message,
          from: process.env.SMS_SENDER_ID,
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${encodedToken}`,
      },
    }
  );
};
