import axios from "axios";

// get main answer
export const getMainAnswer = async (message) => {
  try {
    const response = await axios.post("http://localhost:5000/api/answer", {
      message,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    console.log("error: " + error);
  }
};

// get common question answer
export const getCommonQuestionAnswer = async (message) => {
  try {
    const response = await axios.post("http://localhost:5000/api/question", {
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    console.log("error: " + error);
  }
};

// get subtopic explanation
export const getSubtopicExplanation = async (message) => {
  try {
    const response = await axios.post("http://localhost:5000/api/subtopic", {
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    console.log("error: " + error);
  }
};

// get quiz feedback
export const getQuizFeedback = async (question, answer) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/quizFeedback",
      {
        question,
        answer,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    console.log("error: " + error);
  }
};

// get quiz answer
export const getQuizAnswer = async (message) => {
  try {
    const response = await axios.post("http://localhost:5000/api/quizAnswer", {
      message,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    console.log("error: " + error);
  }
};
