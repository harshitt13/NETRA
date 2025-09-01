<div align="center">

<pre>
███╗   ██╗███████╗████████╗██████╗  █████╗
████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
██╔██╗ ██║█████╗     ██║   ██████╔╝███████║
██║╚██╗██║██╔══╝     ██║   ██╔══██╗██╔══██║
██║ ╚████║███████╗   ██║   ██║  ██║██║  ██║
╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
</pre>

An AI-Powered Intelligence Platform for Detecting and Dismantling Complex Money Laundering Networks.

</div>

Project Netra (Sanskrit for "eye") is a next-generation financial investigation platform designed to provide law enforcement and financial intelligence units with a clear, unified view of complex financial networks. By leveraging a hybrid risk-scoring engine, graph analytics, and AI-powered summarization, Netra empowers investigators to detect, analyze, and dismantle sophisticated money laundering operations with unprecedented speed and accuracy.

✨ Core Features
🧠 Hybrid Risk-Scoring Engine: Combines a robust rule-based system (detecting patterns like structuring, income discrepancy) with an unsupervised Machine Learning model (Isolation Forest) to flag anomalous transactions.

🕸️ Interactive Network Graph: Utilizes a Neo4j graph database to render stunning, interactive visualizations of financial networks, allowing investigators to visually trace the flow of funds and uncover hidden connections between entities.

🤖 AI-Powered Case Summaries: Leverages Google's Gemini LLM to automatically generate concise, human-readable narrative summaries of complex cases from structured data, saving hours of manual analysis.

📋 Comprehensive Investigator's Workspace: A multi-tabbed interface providing a 360° view of entities, a financial transaction timeline, and a real-time notes panel for a complete case management experience.

📄 Automated PDF Reporting: Generates detailed, professional PDF reports for any investigated case with a single click, compiling all data, visualizations, and notes.

🔑 Secure Authentication: Built with Firebase Authentication to ensure only authorized investigators can access the platform.

🛠️ Tech Stack & Architecture
The project is built with a modern, scalable, and AI-ready technology stack, designed for rapid development and high performance.

Backend: Flask (Python)

Frontend: React (with Vite for a blazing-fast dev experience)

Primary Database (Case Management): Firebase Firestore

Graph Database (Network Analysis): Neo4j

Authentication: Firebase Authentication

AI & Machine Learning:

Core ML: Scikit-learn, Pandas, NumPy

AI Summarization: Google Gemini API

Data Visualization: React-Force-Graph-2D, Recharts

Styling: Tailwind CSS

System Flow

1. Data Generation --> 2. ML Model Training --> 3. Flask Backend API --> 4. React Frontend
   | | | (serves data) | (visualizes data)
   +-----> Neo4j & CSVs +-----> .pkl Model +-----> Gemini API +-----> User Interaction
   +-----> Firebase

A detailed architecture diagram is available in frontend/docs/Project_Architecture.png.

🚀 Getting Started
Follow these instructions to get the entire platform up and running on your local machine.

Prerequisites
Python: Version 3.10+

Node.js: Version 18.x or later (with npm)

Neo4j Desktop: The easiest way to run a local Neo4j graph database. Download here.

1. Configuration & Setup
   Before running the application, you need to set up your environment variables and Firebase credentials.

A. Clone the Repository

git clone [https://github.com/your-username/project-netra.git](https://github.com/your-username/project-netra.git)
cd project-netra

B. Set Up Firebase

Go to the Firebase Console and create a new project.

Add a new Web App to your project. Copy the firebaseConfig object provided.

Paste this object into frontend/src/firebase/firebaseConfig.js.

In your Firebase project settings, go to the Service Accounts tab.

Click "Generate new private key". This will download a .json file.

Important: This step is for the backend, but it's related. The backend is currently set up to use CSVs. For a full production setup with Firebase on the backend, you would use this key. For this hackathon, the frontend config is sufficient.

C. Set Up Backend Environment

Navigate to the backend directory: cd backend

Create a file named .flaskenv and paste the following content into it. You will need to get your own API keys.

# Flask Configuration

FLASK_APP=app.py
FLASK_ENV=development

# Neo4j Database Credentials (update with your local instance details)

NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="your_neo4j_password"

# Google Gemini API Key for AI Summaries

# Get your key from Google AI Studio: [https://aistudio.google.com/](https://aistudio.google.com/)

GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

2. Installation
   A. Backend Dependencies

# Navigate to the backend directory if you aren't already there

cd backend

# Create and activate a virtual environment

python -m venv venv
source venv/bin/activate # On Windows, use `venv\Scripts\activate`

# Install all required Python packages

pip install -r requirements.txt

B. Frontend Dependencies

# Navigate to the frontend directory from the root

cd ../frontend

# Install all required Node.js packages

npm install

3. Running the Application
   This is a multi-step process. You will need multiple terminal windows open.

Step 1: Start Neo4j

Open Neo4j Desktop.

Create a new local database project.

Start the database. Make sure the bolt port is 7687 and set your password. Update the .flaskenv file with this password.

Step 2: Generate Synthetic Data

This is the first code you need to run. It creates the CSV files that the entire application depends on.

In a terminal at the project root (/project-netra):

python data-generation/generate_data.py

Verify that the CSV files have been created in the /generated-data directory.

Step 3: Train the Machine Learning Model

Now, train the anomaly detection model on the new transaction data.

In a terminal at the /backend directory (with the virtual environment activated):

python train_model.py

Verify that isolation_forest.pkl has been created in the /backend/models directory.

Step 4: Start the Backend Server

In the same terminal at the /backend directory:

flask run

The Flask server should now be running, typically on http://127.0.0.1:5000.

Step 5: Start the Frontend Server

Open a new terminal and navigate to the /frontend directory.

cd frontend
npm run dev

Vite will start the development server, and your browser should automatically open to http://localhost:3000.

You can now access and test the full Project Netra application!

📂 Project Structure
/project-netra
|
|-- /backend (Flask API)
|-- /frontend (React UI)
|-- /data-generation (Python Scripts)
|-- /generated-data (Output CSVs)
|-- /docs (Presentation & Architecture)
|-- README.md

A more detailed file-by-file breakdown is available in the project documentation.

I hope this helps you to win the hackathon.
