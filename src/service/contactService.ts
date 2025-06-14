import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

interface IdentifyRequest {
    email?: string;
    phoneNumber?: string;
}

export const handleIdentify = async ({ email, phoneNumber }: IdentifyRequest) => {

    // find all matching contact (by email and phone)
    const matchedContacts = await prisma.contact.findMany({
        where: {
            OR: [
                email ? { email } : undefined,
                phoneNumber ? { phoneNumber } : undefined
            ].filter(Boolean) as any
        },
        orderBy: { createdAt: 'asc' }
    });
    
    // creating new contact when no contact found
    if (matchedContacts.length === 0) {
        const newContact = await prisma.contact.create({
            data: {
                email,
                phoneNumber,
                linkPrecedence: 'primary',
            }
        });

        return {
            primaryContactId: newContact.id,
            emails: [newContact.email].filter(Boolean) as string[],
            phoneNumber: [newContact.phoneNumber].filter(Boolean) as string[],
            secondaryContactIds: [],
        };
    }

    // if match exist then identify contact as primary
    const primaryContact = matchedContacts.find(c => c.linkPrecedence === 'primary') || matchedContacts[0];

    //filtering out the primary contact from the matchedContacts list, so left with only the secondary contacts.
    const secondaryContacts = matchedContacts.filter(c => c.id !== primaryContact.id);

     // Create a new secondary contact if current email or phone is new
    const alreadyExists = matchedContacts.some(c => c.email === email && c.phoneNumber === phoneNumber);

    let newSecondary: any = null;
    if (!alreadyExists && (email || phoneNumber)) {
        newSecondary = await prisma.contact.create({
            data: {
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: 'secondary',
            }
        });
        secondaryContacts.push(newSecondary);
    }

    // Merge all related contacts
    const relatedContacts = await prisma.contact.findMany({
        where: {
            OR: [
                { id: primaryContact.id },
                { linkedId: primaryContact.id }
            ]
        },
        orderBy: { createdAt: 'asc' }
    });

    const emails = Array.from(
        new Set(relatedContacts.map(c => c.email).filter(Boolean))
    ) as string[];

    const phoneNumbers = Array.from(
        new Set(relatedContacts.map(c => c.phoneNumber).filter(Boolean))
    ) as string[];

    const secondaryContactIds = relatedContacts
        .filter(c => c.linkPrecedence === 'secondary')
        .map(c => c.id);

    return {
        primaryContatctId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds,
    };
}