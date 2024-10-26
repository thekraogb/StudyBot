
// set user's first message as chat's title
export const setTitle = async (chat) => {
  if (chat.messages.length <= 3) {
    const populatedChat = await chat.populate('messages');

    for (let i = 0; i < populatedChat.messages.length; i++) {
      const message = populatedChat.messages[i];

      if (message.sender === 'user') {
        chat.title = message.message; 
        break; 
      }
    }
  }

  return chat; 
};

