import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;

export const getAnswer = async (req, res) => {
  const { message } = req.body;

  // get chatgpt's answer
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a fault-tolerant assistant for STEM-related topics. Answer questions or messages related to STEM" +
              "with medium to long responses. Explain your answer using technical terms but in simple words." +
              "Resposne with 'None' if the messages are irrelevant.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    let answer = data.choices[0].message.content;

    // get options (common questions, quizzes, etc)
    const optionsResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Based on the following STEM-related answer, suggest 3 common questions related to the topic," +
                "3 subtopics for further exploration, and 3 quiz questions to test understanding of the topic." +
                "Return the response in the following JSON format:\n\n" +
                `{
                "commonQuestions": ["Question 1", "Question 2", "Question 3"],
                "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"],
                "quizzes": ["Quiz 1", "Quiz 2", "Quiz 3"]
              }\n\n` +
                "Make sure the output strictly follows this structure." ,
            },
            {
              role: "user",
              content: answer,
            },
          ],
        }),
      }
    );

    const optionsData = await optionsResponse.json();
    let options = optionsData.choices[0].message.content;

    // convert options string into a JSON object
    try {
      options = JSON.parse(options);
    } catch (error) {
      console.error("Error parsing options:", error);
      options = {};
    }
    // assign a default response if agent's response is 'None'
    answer =
      answer && answer !== "None"
        ? answer
        : "I'm here to help you with STEM related topics.";

    res.status(200).json({
      answer: answer,
      options: options,
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send("Error fetching data");
    }
  }
};

export const getQuestion = async (req, res) => {
  const { message } = req.body;

  // get chatgpt's answer
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant for STEM-related topics. Answer questions directly" +
              "with medium to long responses. Explain your answer using technical terms but in simple words." +
              "Resposne with 'None' if the messages are irrelevant.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    let answer = data.choices[0].message.content;

    // get common questions options
    const optionsResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Based on the following answer, suggest 3 common questions related to the answer." +
                "Return the response in the following JSON format:\n\n" +
                `{
                  "commonQuestions": ["Question 1", "Question 2", "Question 3"]
                }\n\n` +
                "Make sure the output strictly follows this structure.",
            },
            {
              role: "user",
              content: answer,
            },
          ],
        }),
      }
    );

    const optionsData = await optionsResponse.json();
    let options = optionsData.choices[0].message.content;

    // convert options string into a JSON object
    try {
      options = JSON.parse(options);
    } catch (error) {
      console.error("Error parsing options:", error);
      options = {};
    }
    // assign a default response if agent's response is 'None'
    answer =
      answer && answer !== "None"
        ? answer
        : "I'm here to help you with STEM related topics.";

    res.status(200).json({
      answer: answer,
      options: options,
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send("Error fetching data");
    }
  }
};

export const getsubtopic = async (req, res) => {
  const { message } = req.body;
  // get chatgpt's answer
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant for STEM-related topics. Answer questions or messages directly" +
              "with medium to long responses. Explain your answer using technical terms but in simple words." +
              "Resposne with 'None' if the messages are irrelevant.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    let answer = data.choices[0].message.content;

    // get common questions options
    const optionsResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Based on the following answer, suggest 3 subtopics related to the answer." +
                "Return the response in the following JSON format:\n\n" +
                `{
              "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]
            }\n\n` +
                "Make sure the output strictly follows this structure.",
            },
            {
              role: "user",
              content: answer,
            },
          ],
        }),
      }
    );

    const optionsData = await optionsResponse.json();
    let options = optionsData.choices[0].message.content;

    // convert options string into a JSON object
    try {
      options = JSON.parse(options);
    } catch (error) {
      console.error("Error parsing options:", error);
      options = {};
    }
    // assign a default response if agent's response is 'None'
    answer =
      answer && answer !== "None"
        ? answer
        : "I'm here to help you with STEM related topics.";

    res.status(200).json({
      answer: answer,
      options: options,
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send("Error fetching data");
    }
  }
};

export const getQuizFeedback = async (req, res) => {
  const { question, answer } = req.body;

  // get chatgpt's feedback
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant for STEM-related topics. Give feedback on the user's answer.",
          },
          {
            role: "user",
            content: `Question: ${question}\nAnswer: ${answer}`,
          },
        ],
      }),
    });

    const data = await response.json();
    let feedback = data.choices[0].message.content;

    // get common questions options
    const optionsResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Based on the following question, suggest 3 quiz questions related to the question." +
                "Return the response in the following JSON format:\n\n" +
                `{
              "quizzes": ["Quiz 1", "Quiz 2", "Quiz 3"]
            }\n\n` +
                "Make sure the output strictly follows this structure.",
            },
            {
              role: "user",
              content: question,
            },
          ],
        }),
      }
    );

    const optionsData = await optionsResponse.json();
    let options = optionsData.choices[0].message.content;

    // convert options string into a JSON object
    try {
      options = JSON.parse(options);
    } catch (error) {
      console.error("Error parsing options:", error);
      options = {};
    }

    res.status(200).json({
      feedback: feedback,
      options: options,
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send("Error fetching data");
    }
  }
};

export const getQuizAnswer = async (req, res) => {
  const { message } = req.body;

  // get chatgpt's answer
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant for STEM-related topics. Answer the quiz directly.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    let answer = data.choices[0].message.content;

    // get common questions options
    const optionsResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Based on the following answer, suggest 3 quiz questions related to the answer." +
                "Return the response in the following JSON format:\n\n" +
                `{
              "quizzes": ["Quiz 1", "Quiz 2", "Quiz 3"]
            }\n\n` +
                "Make sure the output strictly follows this structure.",
            },
            {
              role: "user",
              content: answer,
            },
          ],
        }),
      }
    );

    const optionsData = await optionsResponse.json();
    let options = optionsData.choices[0].message.content;

    // convert options string into a JSON object
    try {
      options = JSON.parse(options);
    } catch (error) {
      console.error("Error parsing options:", error);
      options = {};
    }

    res.status(200).json({
      answer: answer,
      options: options,
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send("Error fetching data");
    }
  }
};
