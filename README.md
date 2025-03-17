# AI-Based Resume Screening and Ranking System

Repo Link : https://github.com/Awaisetics/PSE-Assessment-2

This project is a full-stack application that uses AI to screen and rank resumes for a job. The system consists of two main components:

- **Frontend:** Built with Next.js, allowing users to sign in, create jobs, and upload resumes.
- **Backend:** Built with FastAPI (Python) that performs the following steps:
  1. **Resume Parsing:** Extracts text from uploaded PDF resumes.
  2. **Job Matching:** Computes a relevancy score between the job description and each resume using semantic similarity.
  3. **Interview Question Generation:** Generates tailored interview questions based on the resume and job description.
  4. **Ranking & Persistence:** Ranks the resumes by relevancy and saves the analysis to a MongoDB database to avoid repeated processing.

## Project Structure

```
├── frontend         # Next.js frontend application
└── backend          # FastAPI backend application
    ├── main.py      # Main FastAPI app with analysis endpoint (/analyze-job)
    ├── requirements.txt
    └── .env         # Environment variables (not committed)
```

## Prerequisites

- **Node.js** (v14 or later) for the frontend
- **Python 3.8+** for the backend
- **MongoDB**: A running instance (local or remote) for storing jobs, resumes, and analysis results.
- Optionally, a cloud service for resume file storage (e.g., Cloudinary).

## Setup Instructions

### Backend (FastAPI)

1. **Navigate to the `backend` directory:**

   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment (recommended):**

   ```bash
   python -m venv venv
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install the required Python packages:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**

   Create a `.env` file in the `backend` directory and set your environment variables. For example:

   ```env
   MONGODB_URI="mongodb://localhost:27017/resume_system"
   HUGGINGFACE_HUB_TOKEN="your_huggingface_token_if_needed"
   ```

5. **Run the FastAPI Application:**

   ```bash
   uvicorn main:app --reload
   ```

   The backend will be available at `http://127.0.0.1:8000`.

### Frontend (Next.js)

1. **Navigate to the `frontend` directory:**

   ```bash
   cd ../frontend
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   # or if you use yarn:
   # yarn install
   ```

3. **Start the Next.js development server:**

   ```bash
   npm run dev
   # or if you use yarn:
   # yarn dev
   ```

   The frontend will be available at `http://localhost:3000`.

## Usage

1. **Sign in with Google** via the frontend.
2. **Create a new job:** Enter job title and description.
3. **Upload resumes:** Resumes are uploaded to Cloudinary (or your chosen file storage), and metadata is stored in MongoDB.
4. **Analyze Job:** Click the "Analyze Job" button to trigger the FastAPI backend analysis.  
   - The backend extracts text from the resumes.
   - Computes a relevancy score for each resume.
   - Generates tailored interview questions for each candidate.
   - Saves the analysis result in MongoDB so that subsequent requests return the stored result.
5. **Shortlisting:** The UI displays resumes sorted by relevancy, and you can view the generated interview questions.

## Additional Notes

- **Model Resources:** The project uses Hugging Face models (e.g., SentenceTransformer for similarity and FLAN-T5/XL for question generation). Ensure your hardware has sufficient resources; if needed, adjust the model selection or use a cloud inference service.
- **Environment Variables:** Do not commit your `.env` file to version control.
- **Frontend Customization:** The UI logic (such as hiding the "Analyze" button once analysis is available) should be handled in your Next.js frontend.

## License

This project is licensed under the [MIT License](LICENSE).
