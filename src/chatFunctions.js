import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


export const addUserToDatabase = async (name) => {
    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;
      const userName = name; // Default to email prefix if no name
      const userEmail = user.email;
  
      await database()
        .ref('/users/' + userId)
        .set({
          name: userName,
          email: userEmail,
        });
    }
  };

// Send message function
export const sendMessage = async (chatId, messageText) => {
  const userId = auth().currentUser.uid;

  const message = {
    senderId: userId,
    text: messageText,
    timestamp: Date.now(),
  };

  // Push message to the specific chat
  await database()
    .ref(`/chats/${chatId}/messages`)
    .push(message);
};


// Listen for new messages
export const listenForMessages = (chatId, callback) => {
  const messagesRef = database().ref(`/chats/${chatId}/messages`);

  // Listen for child added event (new message)
  messagesRef.on('child_added', snapshot => {
    const message = snapshot.val();
    callback(message);
  });

  // Cleanup listener when no longer needed
  return () => messagesRef.off('child_added');
};


export const generateChatId = (userId1, userId2) => {
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  };
