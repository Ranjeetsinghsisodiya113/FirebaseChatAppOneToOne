import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import { addUserToDatabase } from './chatFunctions';

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
            await auth().createUserWithEmailAndPassword(email, password);
            await addUserToDatabase(name)
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
            <Text style={styles.header}>{isSigningUp ? 'Sign Up' : 'Sign In'}</Text>

            {isSigningUp && <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                keyboardType="default"
            />}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                title={isSigningUp ? 'Create Account' : 'Sign In'}
                onPress={isSigningUp ? signUp : signIn}
            />

            <Button
                title={isSigningUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                onPress={() => setIsSigningUp((prev) => !prev)} // Toggle between sign-up and sign-in mode
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
    },
});

export default SignIn;
