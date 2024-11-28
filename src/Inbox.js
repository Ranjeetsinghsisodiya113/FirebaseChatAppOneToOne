import React, { useState, useEffect } from 'react';
import { View,StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, BackHandler } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Inbox = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => backHandler.remove();
  }, [navigation]);

  function onBackPress() {
    if (navigation.isFocused()) {
      Alert.alert(
       "Exit App",
        "Are you sure you want to exit?",
        [
          {
            text: "No",
            onPress: () => {},
            style: "Yes",
          },
          {
            text: "Yes",
            onPress: () => BackHandler.exitApp(),
          },
        ],
        {
          cancelable: false,
        }
      ); // works best when the goBack is async
      return true;
    }

    return false;
  }

  
  useEffect(() => {
    const usersRef = database().ref('/users');
    const currentUserId = auth()?.currentUser?.uid;

    const fetchUsers = async () => {
      try {
        usersRef.on('value', (snapshot) => {
          const usersData = snapshot.val();
          if (!usersData) {
            setUsers([]);
          } else {
            const userList = Object.keys(usersData)
              .filter((userId) => userId !== currentUserId)
              .map((userId) => ({
                userId,
                name: usersData[userId]?.name || 'Unknown',
                email: usersData[userId]?.email || 'No Email',
              }));
            setUsers(userList);
          }
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        console.log("   ")
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchUsers();

    // Cleanup listener on component unmount
    return () => usersRef.off('value');
  }, []);

  const handleUserPress = (userId, userName) => {
    navigation.navigate('ChatScreen', { userId, userName });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading users...</Text>
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No users found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

<View style={styles.header}>
      <Text style={styles.headerText}>Chat Inbox</Text>
    </View>
    <FlatList
      data={users}
      keyExtractor={(item) => item.userId}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleUserPress(item.userId, item.name,item.token_id)}
          style={styles.userCard}
          activeOpacity={0.7}
        >
          <View>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContainer}
    />
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
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default Inbox;
