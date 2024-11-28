import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ToastAndroid, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { addUserToDatabase } from './chatFunctions';
import { localStorage } from '../src/localstorageProvider';
const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false); // Track whether we're in sign-up or sign-in mode

    // Function to handle sign-up
    const signUp = async () => {


        if (!name) {
            ToastAndroid.show("Please Enter Name", ToastAndroid.LONG)
            return false
        }

        if (!email) {
            ToastAndroid.show("Please Enter Email", ToastAndroid.LONG)
            return false
        }
        if (!password) {
            ToastAndroid.show("Please Enter Password", ToastAndroid.LONG)
            return false
        }

        try {
          let token_id= await localStorage.getItemString("token_id")
          await auth().createUserWithEmailAndPassword(email, password);
          await addUserToDatabase(name,token_id)
          setEmail("")
          setName("")
          setPassword("")
          ToastAndroid.show("Welcome to Chat App! Your Account has Created Successfully", ToastAndroid.LONG)
          navigation.navigate("Inbox")
        } catch (error) {
            ToastAndroid.show(error?.message ? error?.message : "", ToastAndroid.LONG)

        }
    };

    // Function to handle sign-in
    const signIn = async () => {

        if (!email) {
            ToastAndroid.show("Please Enter Email", ToastAndroid.LONG)
            return false
        }
        if (!password) {
            ToastAndroid.show("Please Enter Password", ToastAndroid.LONG)
            return false
        }
        //await auth().signOut();
        try {
            await auth().signInWithEmailAndPassword(email, password);

            setEmail("")
            setName("")
            setPassword("")
            navigation.navigate("Inbox")
            ToastAndroid.show("Welcome to Chat App! You're Sign in", ToastAndroid.LONG)
            //   Alert.alert('Success', 'Logged in successfully!');
        } catch (error) {
            ToastAndroid.show(error?.message ? error?.message : "", ToastAndroid.LONG)
            return false

        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{isSigningUp ? 'Sign Up' : 'Sign In'}</Text>
    </View>
        
       
      
        {/* Conditional Full Name Input (only for sign-up) */}
        {isSigningUp && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            keyboardType="default"
            placeholderTextColor="#aaa"
          />
        )}
      
        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#aaa"
        />
      
        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
      
        {/* Action Button */}
        <TouchableOpacity style={styles.button} onPress={isSigningUp ? signUp : signIn}>
          <Text style={styles.buttonText}>{isSigningUp ? 'Create Account' : 'Sign In'}</Text>
        </TouchableOpacity>
      
        {/* Toggle Button */}
        <TouchableOpacity onPress={() => setIsSigningUp((prev) => !prev)} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {isSigningUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
      
    );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  headerContainer: {
    backgroundColor: '#4A90E2',
    width:'110%',
    height:"10%",
    top:0,
    position:'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  toggleButton: {
    marginTop: 15,
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
});


export default SignIn;
