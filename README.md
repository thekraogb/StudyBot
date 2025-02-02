# StudyBot


**Deployed App**: https://studybot-9qpw.onrender.com

## Description

StudyBot is an interactive study assistant tool made for STEM students to support and accelerate their learning. It helps learners understand different topics by suggesting related questions, breaking down topics into subtopics, and offering quizzes to test understanding. The bot is currently text-based to keep it focused and practical, but it could be expanded beyond text interactions. 


## Get Started
To run the app in dev mode:
1. Open the root directory and install required dependencies

```bash
npm install
```

2. Create ```.env``` file with following credentials:
   - ```PORT```: port number
   - ```API_KEY```: OpenAI API key
   - ```MONGO_URI```: MongoDB connection URI
   - ```ACCESS_TOKEN```: JWT access token
   - ```REFRESH_TOKEN```: JWT refresh token

3. Update the API URL in ```frontend/src/app/api/apislice.js``` file with appropriate backend port

4. Start the frontend 
   
```bash
cd frontend
npm run dev
```
5. Start the backend 

```bash
cd backend
npm run dev
```

