<!-- ctrl+shift+v => for the preview of the readme.md -->
📦 Project Dependencies Overview

This document explains the purpose of each dependency and devDependency used in the project.

✅ Dependencies (Used in the running application)
1. body-parser

Parses incoming request bodies (JSON, form data) and makes them accessible via req.body.

Note: Express 4.16+ already includes body-parser, so you often don't need this package separately.

2. ejs

A templating engine that allows you to generate dynamic HTML using <%= %> syntax.

Used with:

app.set('view engine', 'ejs');

3. express

The main web framework used for routing, handling middleware, and managing server logic.

4. express-validator

A tool for validating and sanitizing user input such as form fields and API payloads.

Example:

check('email').isEmail();

5. mongodb

The official MongoDB driver that allows direct connection and queries to a MongoDB database.

6. mongoose

An ODM (Object Data Modeling) library for MongoDB.
Provides schemas, models, validation, and an easier way to interact with the database.

🛠️ DevDependencies (Used only during development)
1. autoprefixer

Automatically adds vendor prefixes to CSS (e.g., -webkit-, -moz-).
Commonly used with PostCSS or CSS frameworks like TailwindCSS.

2. nodemon

Automatically restarts the server whenever file changes are detected — very useful during development.

3. postcss

A tool that processes CSS using plugins (such as autoprefixer or TailwindCSS) to transform and optimize your styles.

<!-- Explanation about the aadhar encryption function: -->
/*Step-by-Step Explanation (as simple as possible)*/

Here is your function again:

function encryptAadhaar(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}


Let's break it into simple steps…

🟦 1. A random IV (Initialization Vector)
const iv = crypto.randomBytes(IV_LENGTH);

What is an IV?

It is a random 16-byte value.

It makes encryption unpredictable.

Even if two users have the same Aadhaar number,
after encryption both outputs will be different.

Why do we need it?

Otherwise encryption becomes predictable and crackable.

Example:

Aadhaar = 123456789012

If encrypt 5 users with same Aadhaar:

🔐 Without IV → all encrypted outputs look SAME → dangerous

🔐 With IV → all encrypted outputs are DIFFERENT → secure

🟦 2. Create the encryption engine
const cipher = crypto.createCipheriv(
  "aes-256-cbc",
  Buffer.from(ENCRYPTION_KEY),
  iv
);

This does:

Chooses encryption method: AES-256-CBC

Uses your secret key = AADHAAR_SECRET_KEY (must be 32 characters!)

Uses the random IV generated earlier

Think of this as:

“Create a machine that will lock the Aadhaar number using a secret key.”

🟦 3. Encrypt the Aadhaar number
First part
let encrypted = cipher.update(text, "utf8", "hex");


This takes:

input Aadhaar (text)

converts from plain text → encrypted hex string

Final chunk
encrypted += cipher.final("hex");


This finishes the encryption process.

🟦 4. Return IV + encrypted data
return `${iv.toString("hex")}:${encrypted}`;


We return both:

✔ IV (random)
✔ Encrypted Aadhaar number

Stored like:

c7a4f81e5e9a6d4bde98e236f10c4a33:fa34be9ef099d44d88b6a8a...

Why store the IV?

Because you need the same IV to decrypt the Aadhaar later.

✨ Final Summary (super simple)

Here’s what your function does in plain English:

Generate a random IV → makes every encryption unique

Create an AES-256-CBC encryptor with your secret key

Encrypt the Aadhaar number

Return: IV : encrypted_data

This ensures:

Database leaks cannot reveal Aadhaar

Same Aadhaar → always different encrypted output

Only you (with the secret key) can decrypt


2️⃣ Why we still need HMAC (or unique index)

You want Aadhaar numbers to be unique, because:

Each citizen should register only once.

You cannot rely on _id to prevent duplicates in another field.

Two approaches:

a) Unique index on encrypted Aadhaar (not ideal)
aadhaarNumber: { type: String, unique: true }


Problem: Your encryptAadhaar function is non-deterministic, so the same Aadhaar will produce different ciphertexts each time.

MongoDB sees them as different → uniqueness check fails.

b) Store deterministic HMAC for lookup
aadhaarHmac: { type: String, unique: true }


HMAC is deterministic → same Aadhaar always produces same HMAC.

MongoDB can enforce uniqueness on HMAC field, so duplicate Aadhaar cannot be registered.

Security: Original Aadhaar cannot be recovered from HMAC.