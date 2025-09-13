# 🚀 Crypto Wallet Analyzer

A full-stack tool for analyzing cryptocurrency wallets.  
It combines a **backend service** to process wallet data and a **frontend UI** to visualize insights.

---

## 📌 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)


---

## 📖 Overview
Crypto Wallet Analyzer allows users to **inspect wallet activity** and view meaningful analytics through a clean web interface.  
It is designed with modularity in mind: the **backend handles APIs & processing**, while the **frontend renders interactive dashboards**.

---

## ✨ Features
- 🔍 Analyze cryptocurrency wallet addresses  
- 📊 View wallet details, transactions, and activity trends  
- 🌐 Full-stack architecture (backend + frontend)  
- ⚡ Quick local setup with `npm`  
- 📱 User-friendly UI  

---

## 🏗 Architecture

Crypto-Wallet-Analyzer/

├── backend/ # API & server logic

└── frontend/ # Client UI


- **Backend** → Node.js server for wallet data & APIs  
- **Frontend** → Web client to display analysis results  

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express  
- **Frontend:** React (Vite/CRA)  
- **Database (if used):** MongoDB / others  
- **Package Manager:** npm  

*(Adjust if repo specifies additional libs in `package.json`.)*

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (>= 16.x recommended)  
- npm (bundled with Node.js)  

### Installation
Clone the repository:
```bash
git clone https://github.com/shantanu-hazra/Crypto-Wallet-Analyzer.git
cd Crypto-Wallet-Analyzer
```
Backend:
  cd backend

  npm install
  
  node server.js
  

Frontend: (on a different terminal)
  cd frontend

  npm install

  npm run dev
  
