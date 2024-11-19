import { apiSlice } from "../../api/apislice";

export const agentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get main answer
    getMainAnswer: builder.mutation({
      query: (message) => ({
        url: "/agent/answer",
        method: "POST",
        body: message,
      }),
    }),

    // get common question answer
    getCommonQuestionAnswer: builder.mutation({
      query: (message) => ({
        url: "/agent/question",
        method: "POST",
        body: message,
      }),
    }),

    // get subtopic explanation
    getSubtopicExplanation: builder.mutation({
      query: (message) => ({
        url: "/agent/subtopic",
        method: "POST",
        body: message,
      }),
    }),

    // get quiz feedback
    getQuizFeedback: builder.mutation({
      query: ({ question, answer }) => ({
        url: "/agent/quizFeedback",
        method: "POST",
        body: { question, answer },
      }),
    }),

    // get quiz answer
    getQuizAnswer: builder.mutation({
      query: (message) => ({
        url: "/agent/quizAnswer",
        method: "POST",
        body: message,
      }),
    }),
  }),
});

export const {
  useGetMainAnswerMutation,
  useGetCommonQuestionAnswerMutation,
  useGetSubtopicExplanationMutation,
  useGetQuizFeedbackMutation,
  useGetQuizAnswerMutation,
} = agentApiSlice;
