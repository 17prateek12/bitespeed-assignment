# BiteSpeed Identity Reconciliation API

This is a Node.js + TypeScript backend service to solve the identity reconciliation problem — determining the **primary contact** and any related secondary contacts for a given `email` and/or `phoneNumber`.

The deployed url `https://bitespeed-assignment-y3ut.onrender.com/`

Built using:

* 🟦 Express.js
* 🧬 Prisma ORM
* 🐬 PostgreSQL
* 🔐 TypeScript

### 1. Clone the Repository

```bash
https://github.com/17prateek12/bitespeed-assignment
cd bitespeed-assignment
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root with your PostgreSQL connection and Port:

```
DATABASE_URL="postgresql://<username>:<password>@localhost:3306/<database_name>"
PORT = 5000
```
Note: Make sure to URL-encode special characters (e.g., @ becomes %40).

### 4. Database Setup

#### Apply migrations
If starting from scratch:
```
npx prisma migrate dev --name init
```

If pulling from an existing DB:
```
npx prisma db pull
```

Generate Prisma client:
```
npx prisma generate
```

### 5. Running the Server

```
npm run dev
```

The API will start on http://localhost:5000 (or your configured port).

## 📮 API Endpoint

`POST /identify`

Send either an `email`, `phoneNumber`, or both to identify the contact.

### Sample Test case 1:
When customer order for first time with new `phoneNumber` and `email`

📥 Request Body
```
{
    "email":"xyz@gmail.com",
    "phoneNumber":"8287674222"
}
```

📤 Response
```
{
    "contact": {
        "primaryContactId": 10,
        "emails": [
            "xyz@gmail.com"
        ],
        "phoneNumber": [
            "8287674222"
        ],
        "secondaryContactIds": []
    }
}
```


### Sample Test case 2:
When customer has place an order with
`email = 17prateek12@gmail.com` and `phoneNumber=8287674188`
and comeback to place another other with
`email = 17prateek12@gmail.com` and `phoneNumber=8447929008`

📥 Request Body
```
{
    "email":"17prateek12@gmail.com",
    "phoneNumber":"8287674188"
}
```

📤 Response
```
{
    "contact": {
        "primaryContatctId": 1,
        "emails": [
            "17prateek12@gmail.com"
        ],
        "phoneNumbers": [
            "8287674188",
            "8447929008"
        ],
        "secondaryContactIds": [
            2
        ]
    }
}
```