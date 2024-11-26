import React, { useState, useEffect } from 'react';
import {StyleSheet, View,TouchableOpacity, Text, TextInput, Button, FlatList } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { generateChatId } from './chatFunctions';

const ChatScreen = ({ route }) => {
  const { userId, userName } = route.params; // userId and userName passed from Inbox
  const currentUserId = auth().currentUser.uid;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const chatId = generateChatId(currentUserId, userId);

  // Fetch messages for the chat
  useEffect(() => {
    const messagesRef = database().ref(`/chats/${chatId}/messages`);
    
    messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup listener when the component unmounts
    return () => messagesRef.off('child_added');
  }, [chatId]);

  
  // Send message
  const sendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        senderId: currentUserId,
        text: newMessage,
        timestamp: Date.now(),
      };
      await database().ref(`/chats/${chatId}/messages`).push(message);
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
    {/* Chat Header */}
    <View style={styles.header}>
      <Text style={styles.headerText}>Chat with {userName}</Text>
    </View>
  
    {/* Messages List */}
    <FlatList
      data={messages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View
          style={[
            styles.messageContainer,
            item.senderId === currentUserId ? styles.currentUser : styles.otherUser,
          ]}
        >
          <Text style={styles.messageText}>
            {item.senderId === currentUserId ? 'You' : userName}: {item.text}
          </Text>
        </View>
      )}
      contentContainerStyle={styles.messagesList}
    />
  
    {/* Input Section */}
    <View style={styles.inputContainer}>
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type a message..."
        placeholderTextColor="#888"
        style={styles.input}
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  </View>
  
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  messagesList: {
    flexGrow: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: '70%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  currentUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
  },
  otherUser: {
    alignSelf: 'flex-start',
    backgroundColor: '#00ffff',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default ChatScreen;
