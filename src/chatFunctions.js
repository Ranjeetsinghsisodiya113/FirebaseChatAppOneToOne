import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


export const addUserToDatabase = async (name,token_id) => {
    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;
      const userName = name; 
      const userEmail = user.email;
      const user_token = token_id;
  
      await database()
        .ref('/users/' + userId)
        .set({
          name: userName,
          email: userEmail,
          user_token:user_token
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


 export const sendNotification = async (recipientFcmToken, messageContent) => {
    const FCM_SERVER_KEY = 'BIyymBR8iBfA9mhaEneh3u5gIdLSKwjT6-N-fChZAud_HjXJJ2JTFM-ugPYohtnowfbOWMyjiK9M-ISA89OrhKM'; // Replace with your FCM server key from Firebase
  
    const notification = {
      to: recipientFcmToken,
      notification: {
        title: 'Chat Message',
        body: messageContent,
      },
      data: {
        type: 'chat', // Optional: Add custom data
      },
    };
  
    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${FCM_SERVER_KEY}`,
        },
        body: JSON.stringify(notification),
      });
      console.log(response)
      if (response.ok) {
        console.log('Notification sent successfully');
      } else {
        console.error('Failed to send notification:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  
  // Usage
 
  
