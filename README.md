# VotingApp

**VotingApp** is a full-stack online voting system built with **Node.js**, **Express**, **MongoDB**, and **EJS**.  
It features a **User interface for voters** and an **Admin interface for election managers**, with secure authentication, image uploads, and live rankings.

---

## 🌐 Live Demo
https://digital-voting-system-kmkm.onrender.com

---

## 🏗️ Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose  
- **Frontend:** EJS (server-side rendering), HTML, CSS  
- **Authentication:** JWT, bcrypt, role-based middleware  
- **File Storage:** Cloudinary (via Multer memory storage)  
- **Deployment:** Render  

---

## ⚡ Features

### User Interface (Voter)
- Sign up / login (email + Aadhaar verification)  
- Dashboard showing vote status  
- Vote for **active candidates only**  
- Public **ranking page** with live vote counts  
- Aadhaar encrypted & hashed for privacy  

### Admin Interface (Election Manager)
- Admin-only login & protected routes  
- Add candidates with images (Cloudinary)  
- Enable/disable or delete candidates  
- View rankings & election status (placeholder for start/freeze/end)  

### Technical Highlights
- Passwords hashed with bcrypt  
- JWT stored in `httpOnly` cookies  
- Multer memory storage + Cloudinary for image uploads  
- Role-based route protection  
- Responsive UI with reusable EJS partials  

---

## 🔄 User Flow

**User:** Sign up → Login → Dashboard → Vote → Ranking  
**Admin:** Login → Add candidates → Manage candidates → View ranking  

---
## 📁 Project Structure
``` bash
Project Structure

VotingApp/
├─ app.js
├─ controllers/
├─ middleware/
├─ models/ (User, Admin, Candidate, Election)
├─ routes/
├─ utils/ (cloudinary.js)
├─ public/ (css/, images/, readme-images/)
├─ views/
├─ .env
├─ .gitignore
```


---
📸 Screenshots
### User Experience

<p align="center">
  <img src="https://raw.githubusercontent.com/sk1a345/digital-voting-system/refs/heads/main/VotingApp/photo-collage.png.png" alt="User Interface" width="700">
</p>

### Admin Experience
<p align="center">
  <img src="https://raw.githubusercontent.com/sk1a345/digital-voting-system/refs/heads/main/VotingApp/Screenshot%202025-12-01%20220001.png" alt="Admin Dashboard" width: 600>
</p>

### Live Rankings
<p align="center">
  <img src="https://raw.githubusercontent.com/sk1a345/digital-voting-system/refs/heads/main/VotingApp/Screenshot%202025-12-01%20220222.png" alt="Admin Dashboard" width: 700>
</p>

## 💻 Installation (Local)

```bash
# Clone the repo
git clone https://github.com/sk1a345/digital-voting-system.git
cd VotingApp

# Install dependencies
npm install

# Create .env
PORT=3000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_API_SECRET=<cloudinary_api_secret>
AADHAAR_SECRET_KEY=<32_char_secret_for_aadhaar_encryption>

# Start the app
npm start
Open http://localhost:3000


```
---

## 👤 Demo Admin Account

> **For reviewers/testing purposes only/Do not misuse**  
> ⚠️ Make sure to rotate or remove these credentials before real production.

- **Username:** `first-admin`  
- **Password:** `ad@1minPass`

---

## 🔒 Security & Privacy

- Passwords hashed with **bcrypt**  
- Aadhaar numbers encrypted using **AES-256-CBC**  
- Deterministic **HMAC** used for uniqueness checks  
- Admin-only pages protected through **role-based middleware**  
- Environment variables managed via `.env` (never committed)  
- All sensitive operations secured using server-side validations  

---

## 🚀 Future Improvements

- Start / Freeze / End **election state machine**  
- **Two-factor authentication (2FA)** for enhanced user security  
- **Admin action audit logs** for transparency  
- Advanced **analytics dashboard** for election insights  
- Unit tests & full **CI/CD pipeline**  
- API **rate limiting** and brute-force attack protection  
- Multi-admin election roles (SuperAdmin, Moderator, Auditor)

---

## 📄 License

This project is currently **not licensed for public use**.  
You may view the source code, but **reuse, modification, or redistribution is not permitted** without permission.

---
<p align="center">
  Developed and maintained with 💙, ☕, and endless patience by <b>Sneha Sanjay Kohale</b>.
</p>
