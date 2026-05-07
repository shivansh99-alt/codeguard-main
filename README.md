CodeGuard — AI Plagiarism Detection System
CodeGuard is a web-based plagiarism detection system for source code files. It compares multiple code files, calculates similarity percentages, highlights matching lines, and provides AI-style plagiarism explanations.

Features
Upload and compare multiple code files
Detect code similarity using LCS algorithm
Similarity percentage scoring
Matching line detection
Side-by-side code comparison
GitHub/raw URL code fetching
AI-generated plagiarism explanation
React frontend + Flask backend
Tech Stack
Frontend
React
Vite
Axios
Backend
Flask
Flask-CORS
Python
Project Structure
codeguard/
│
├── frontend/
│
├── backend/
│   ├── app.py
│   ├── huggingface.py
│   ├── scraper.py
│   ├── tokenizer.py
│   └── .env
│
└── README.md
Backend Setup
1. Open terminal
cd backend
2. Install dependencies
pip install -r requirements.txt
3. Create .env file
Inside the backend folder create:

.env
Add:

HF_TOKEN=your_huggingface_token
Run Backend
python app.py
Backend runs on:

http://127.0.0.1:5000
Frontend Setup
1. Open another terminal
cd frontend
2. Install dependencies
npm install
3. Start frontend
npm run dev
Frontend runs on:

http://localhost:5173
How to Use
Start backend server
Start frontend server
Open frontend in browser
Upload code files
Click compare
View similarity results and explanations
GitHub URL Support
CodeGuard can fetch and compare code directly from:

GitHub blob URLs
Raw GitHub URLs
Direct file URLs
Security Note
The .env file is intentionally excluded from GitHub for security reasons.

Users must create their own .env file with their own Hugging Face token.
