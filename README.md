# SevaSaathi 🏛️

SevaSaathi is an AI-powered government service assistant that helps users understand and navigate government services through a simple and guided process.

## 🚀 Features

* 🤖 AI-powered assistance
* 📄 Government service and document guidance
* 📝 Guided application process
* 🌐 Multilingual support
* 🎙️ Voice support
* 🔐 User consent for sensitive actions
* 📋 Application status tracking
* 🧾 Audit logs
* 🧑‍💼 Human assistance when required

## 🛠️ Tech Stack

* **Frontend:** React, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **AI:** Gemini API
* **APIs:** REST APIs

## 📁 Project Structure

```text
SevaSaathi/
├── src/
├── public/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── server.js
├── package.json
└── README.md
```

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/anmolbhagat13/SevaSaathi.git
cd SevaSaathi
```

### Install frontend dependencies

```bash
npm install
```

### Install backend dependencies

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sevasaathi
GEMINI_API_KEY=your_gemini_api_key
```

### Run the backend

```bash
npm run dev
```

### Run the frontend

Open another terminal in the project root:

```bash
npm run dev
```

## 🎯 Project Goal

The goal of SevaSaathi is to make government services easier to access by guiding users through the process of understanding requirements, managing documents, completing applications, and tracking their requests.

## 🔮 Future Scope

* OCR-based document verification
* More regional languages
* Real government service integrations
* Advanced voice interaction
* Human support dashboard
* Automated application status updates

## 👨‍💻 Repository

[SevaSaathi on GitHub](https://github.com/anmolbhagat13/SevaSaathi)
