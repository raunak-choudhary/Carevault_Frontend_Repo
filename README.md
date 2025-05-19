# CareVault Frontend

CareVault is an AI-powered healthcare management platform designed to centralize and simplify access to personal medical data. It enables users to upload, organize, and query medical documents through an intuitive interface, while also receiving support from an intelligent Retrieval-Augmented Generation (RAG) system for document understanding and assistance.

This repository contains only the frontend codebase developed using React. The corresponding backend implementation can be found here:  
[CareVault Backend Repository](https://github.com/raunak-choudhary/Carevault_Backend_Repo.git)

## System Architecture 
(Please check the Architecture Diagram in the Frontend Repository of Carevault)

- **Users** interact with the React frontend.
- The frontend communicates with a **Python backend** to handle data and AI requests.
- The backend interfaces with **Supabase**, which handles both file storage (via buckets) and structured data (via PostgreSQL).
- Uploaded **User Medical Documents** are accessed by a **RAG system**, enabling intelligent retrieval and responses based on the document content.

## Authors

- **Raunak Choudhary**  
  Master's in Computer Science, NYU Tandon  
  [rc5553@nyu.edu](mailto:rc5553@nyu.edu)

- **Aninda Ghosh**  
  Master's in Computer Science, NYU Tandon  
  [ag7762@nyu.edu](mailto:ag7762@nyu.edu)
