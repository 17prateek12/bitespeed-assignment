import { Request, Response } from 'express';
import { handleIdentify } from '../service/contactService';

export const identifyContact = async (req: Request, res: Response): Promise<void> => {
  try {
    let { email, phoneNumber } = req.body;

    email = email?.trim() || undefined;
    phoneNumber = phoneNumber?.trim() || undefined;

    if (!email && !phoneNumber) {
        res.status(400).json({ message: 'Either email or phoneNumber must be provided' });
        return
    }

    const result = await handleIdentify({ email, phoneNumber });

    res.status(200).json({ contact: result });
  } catch (error) {
    console.error('Identify contact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
