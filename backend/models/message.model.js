import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		message: {
			type: String,
			// required: true,
		},
		sender: {
			type: String,
			required: true,
		},
        chatId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        optionType: {
            type: String,
        },
        commonQuestions: {
            type: [String],
        },
        subtopics: {
            type: [String],
        },
        quizzes: {
            type: [String],
        },
        takeQuiz: {
            type: Boolean,
        },
        quizId: {
            type: String,
        },
        quizChoices: {
            type: [String],
        }
	},
	{
		timestamps: true, 
	}
);

const Message = mongoose.model("Message", messageSchema);

export default Message;