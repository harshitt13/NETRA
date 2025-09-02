# Project NETRA

<div align="center">

<pre>
███╗   ██╗███████╗████████╗██████╗  █████╗
████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
██╔██╗ ██║█████╗     ██║   ██████╔╝███████║
██║╚██╗██║██╔══╝     ██║   ██╔══██╗██╔══██║
██║ ╚████║███████╗   ██║   ██║  ██║██║  ██║
╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
</pre>

**An AI-Powered Intelligence Platform for Detecting and Dismantling Complex Money Laundering Networks**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/react-18.2+-blue.svg)](https://reactjs.org)
[![Neo4j](https://img.shields.io/badge/neo4j-5.x-green.svg)](https://neo4j.com)

</div>

## 🔍 Overview

Project Netra (Sanskrit for "eye") is a next-generation financial investigation platform designed to provide law enforcement and financial intelligence units with a clear, unified view of complex financial networks. By leveraging a hybrid risk-scoring engine, graph analytics, and AI-powered summarization, Netra empowers investigators to detect, analyze, and dismantle sophisticated money laundering operations with unprecedented speed and accuracy.

## ✨ Core Features

- 🧠 **Hybrid Risk-Scoring Engine**: Combines rule-based detection with machine learning (Isolation Forest) to identify anomalous financial patterns
- 🕸️ **Interactive Network Graph**: Neo4j-powered visualizations of financial networks and transaction flows
- 🤖 **AI-Powered Case Summaries**: Google Gemini LLM integration for automated case narrative generation
- 📋 **Comprehensive Investigation Workspace**: Multi-tabbed interface with entity details, timelines, and real-time notes
- 📄 **Automated PDF Reporting**: Professional investigation reports with complete case documentation
- 🔑 **Secure Authentication**: Firebase-based authentication and authorization system

## 🏗️ Architecture

### Backend (`/backend/`)

- **Framework**: Flask (Python)
- **Database**: Neo4j (graph), Firebase Firestore (documents), CSV (synthetic data)
- **AI/ML**: Google Gemini API, Scikit-learn
- **Key Services**:
  - Risk scoring and anomaly detection
  - Graph analytics and network analysis
  - AI-powered summarization
  - Case management
  - PDF report generation

### Frontend (`/frontend/`)

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Visualization**: React-Force-Graph-2D, Recharts
- **State Management**: Custom hooks and context

### Data Generation (`/data-generation/`)

- **Synthetic Data**: Faker-based generation with embedded money laundering patterns
- **Neo4j Integration**: Automated data loading scripts
- **Pattern Detection**: Structuring, shell company layering, mule account patterns

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18.x+
- Neo4j Desktop or Cloud instance
- Firebase project (for authentication and case management)

### 1. Clone the Repository

```bash
git clone https://github.com/AnuragWaskle/project-NETRA.git
cd project-NETRA
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file with:
# GEMINI_API_KEY=your_gemini_api_key
# NEO4J_URI=bolt://localhost:7687
# NEO4J_USER=neo4j
# NEO4J_PASSWORD=your_password

# Run the application
python app.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure Firebase
# Update src/firebase/firebaseConfig.js with your Firebase project details

# Start development server
npm run dev
```

### 4. Data Setup

```bash
# Generate synthetic data
cd data-generation
python generate_data.py

# Load data into Neo4j
cd ../backend/data-generation
python load_to_neo4j.py
```

## 📊 Money Laundering Detection Patterns

The system detects several sophisticated financial crime patterns:

- **Structuring**: Breaking large transactions into smaller amounts to avoid reporting thresholds
- **Shell Company Layering**: Using corporate entities to obscure the source of funds
- **Income-Expense Discrepancies**: Identifying lifestyle vs. declared income mismatches
- **Property Investment Anomalies**: Detecting unexplained real estate acquisitions
- **Tax Evasion Indicators**: Non-filing and inconsistent reporting patterns

## 🛡️ Security Features

- **Token-based Authentication**: Firebase JWT integration
- **API Security**: Protected endpoints with authorization middleware
- **Data Privacy**: Secure handling of sensitive financial information
- **Audit Trail**: Comprehensive logging of user actions and system events

## 📁 Project Structure

```
project-NETRA/
├── backend/                    # Flask API server
│   ├── app.py                 # Main application entry point
│   ├── requirements.txt       # Python dependencies
│   ├── services/              # Business logic services
│   ├── utils/                 # Utility functions
│   ├── data-generation/       # Neo4j data loading
│   └── generated-data/        # CSV data files
├── frontend/                   # React application
│   ├── src/                   # Source code
│   ├── public/                # Static assets
│   ├── package.json          # Node.js dependencies
│   └── README.md             # Frontend documentation
├── data-generation/           # Synthetic data generation
│   ├── generate_data.py      # Main data generation script
│   └── patterns.py           # Money laundering patterns
└── .gitignore                # Git ignore rules
```

## 📈 Performance & Scalability

- **Database**: Neo4j for high-performance graph queries
- **Caching**: Redis integration for frequently accessed data
- **Background Processing**: Celery for long-running analysis tasks
- **API Rate Limiting**: Built-in request throttling
- **Monitoring**: Comprehensive logging and metrics collection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Group Members

<table style="width: 100%; border-collapse: collapse; text-align:center;">
        <tr>
            <th><a href="https://github.com/AnuragWaskle">Anurag Waskle</a></th>
            <th><a href="https://github.com/Soham16Malvankar">Soham S. Malvankar</a></th>
            <th><a href="https://github.com/harshitt13">Harshit Kushwaha</a></th>
            <th><a href="https://github.com/aaryan01313">Aryan Pandey</a></th>
            <th><a href="https://github.com/deeptisingh27">Deepti Singh</a></th>
        </tr>
        <tr>
            <td><img src="https://avatars.githubusercontent.com/AnuragWaskle" alt="Anurag Waskle"></td>
            <td><img src="https://avatars.githubusercontent.com/Soham16Malvankar" alt="Soham S. Malvankar"></td>
            <td><img src="https://avatars.githubusercontent.com/harshitt13" alt="Harshit Kushwaha"></td>
            <td><img src="https://avatars.githubusercontent.com/aaryan01313" alt="Aryan Pandey"></td>
            <td><img src="https://avatars.githubusercontent.com/deeptisingh27" alt="Deepti Singh"></td>
        </tr>
</table>

## 📞 Support

For questions, issues, or contributions, please:

- Open an issue on GitHub
- Check the documentation in each module's README

---
