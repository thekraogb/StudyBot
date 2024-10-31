# StudyBot


**Deployed App**: https://studybot-9qpw.onrender.com

## Description

StudyBot is an interactive study assistant bot made for STEM students. It helps learners understand different topics by suggesting related questions, breaking down topics into subtopics, and offering quizzes to test understanding. The bot is currently text-based to keep it focused and practical, but it could be expanded beyond text interactions. 


## Get Started
To run the app in dev mode:
1. Run the frontend
   
```bash
cd frontend
npm run dev
```
2. Run the backend

```bash
cd backend
npm run dev
```
3. Create ```.env``` file with following credentials:
   - ```PORT```: port number
   - ```API_KEY```: OpenAI API key
   - ```MONGO_URI```: MongoDB connection URI
   - ```ACCESS_TOKEN```: JWT accesss token
   - ```REFRESH_TOKEN```: JWT refresh token
