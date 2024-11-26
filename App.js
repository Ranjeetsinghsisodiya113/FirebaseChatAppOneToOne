import { SafeAreaView,StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SignIn from './src/SignIn'
import { FirebaseApp } from '@react-native-firebase/app'; // This import is required to initialize Firebase
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './src/ChatScreen';
import Inbox from './src/Inbox';
const App = () => {
  const Stack = createStackNavigator();
  useEffect(() => {
    // This will ensure Firebase is initialized
    const initializeFirebase = async () => {
      const app = FirebaseApp(); // Ensure Firebase is initialized
      if (app.name !== '[DEFAULT]') {
        console.error('Firebase not initialized correctly.');
      }
    };

    initializeFirebase();
  }, []);
 
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown:false}} />
      <Stack.Screen name="SignIn" component={SignIn} options={{headerShown:false}}/>
      <Stack.Screen name="Inbox" component={Inbox} options={{headerShown:false}} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})


// import React, { useState, useRef } from 'react';
// import {
//   Animated,
//   PanResponder,
//   SafeAreaView,
//   StatusBar,
//   View,
//   StyleSheet,
//   Dimensions,
//   Alert,
// } from 'react-native';

// // Get device width and height
// const { width } = Dimensions.get('window');
// const GRID_SIZE = width * 0.9;
// const CELL_SIZE = GRID_SIZE / 3.1;
// const CIRCLE_SIZE = CELL_SIZE * 0.8;
// const CENTER_INDEX = 4;

// function App() {
//   let initialData = [
//     { color: 'red', status: false, colorStatus: 2 },
//     { color: 'red', status: false, colorStatus: 2 },
//     { color: 'red', status: false, colorStatus: 2 },
//     { color: 'lightgrey', status: false, colorStatus: 3 },
//     { color: 'lightgrey', status: false, colorStatus: 3 },
//     { color: 'lightgrey', status: false, colorStatus: 3 },
//     { color: 'green', status: false, colorStatus: 1 },
//     { color: 'green', status: false, colorStatus: 1 },
//     { color: 'green', status: false, colorStatus: 1 },
//   ];

//   const [data, setData] = useState(initialData);
//   const [turn, setTurn] = useState('red');
//   const dragPosition = useRef(new Animated.ValueXY()).current;
//   const [draggingIndex, setDraggingIndex] = useState(null);

//   const isNearby = (fromIndex, toIndex) => {
//     const fromRow = Math.floor(fromIndex / 3);
//     const fromCol = fromIndex % 3;
//     const toRow = Math.floor(toIndex / 3);
//     const toCol = toIndex % 3;

//     const isDiagonalSwapWithCenter =
//       (fromIndex === CENTER_INDEX || toIndex === CENTER_INDEX) &&
//       Math.abs(fromRow - toRow) <= 1 &&
//       Math.abs(fromCol - toCol) <= 1;

//     const isDirectlyAdjacent =
//       (Math.abs(fromRow - toRow) === 1 && fromCol === toCol) || 
//       (Math.abs(fromCol - toCol) === 1 && fromRow === toRow);

//     return isDirectlyAdjacent || isDiagonalSwapWithCenter;
//   };

//   const swapItems = (fromIndex, toIndex) => {
//     const newData = [...data];
//     const temp = newData[fromIndex];
//     newData[fromIndex] = newData[toIndex];
//     newData[toIndex] = temp;
//     setData(newData);
//     checkWin(newData); // Check for a win after swapping
//   };

//   const checkWin = (currentData) => {
//     const gridColors = currentData.map((item) => item.color);
//     const winningCombinations = [
//       [3, 4, 5],  
//       [0, 3, 6],
//       [1, 4, 7],
//       [2, 5, 8],
//       [0, 4, 8],
//       [2, 4, 6],
//     ];

//     for (const combination of winningCombinations) {
//       const [a, b, c] = combination;
//       if (
//         gridColors[a] !== 'lightgrey' &&
//         gridColors[a] === gridColors[b] &&
//         gridColors[b] === gridColors[c]
//       ) {
       
       
//         Alert.alert(`${gridColors[a].toUpperCase()} WINS!`);
//         return;
//       }
//     }
//   };

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => draggingIndex !== null,
//     onPanResponderMove: Animated.event(
//       [null, { dx: dragPosition.x, dy: dragPosition.y }],
//       { useNativeDriver: false }
//     ),
//     onPanResponderRelease: (e, gestureState) => {
//       const { dx, dy } = gestureState;
//       const row = Math.floor(draggingIndex / 3);
//       const col = draggingIndex % 3;
//       const newRow = Math.round((row * CELL_SIZE + dy) / CELL_SIZE);
//       const newCol = Math.round((col * CELL_SIZE + dx) / CELL_SIZE);
//       const newIndex = newRow * 3 + newCol;

//       let swapHappened = false;

//       if (
//         newIndex >= 0 &&
//         newIndex < data.length &&
//         newIndex !== draggingIndex &&
//         data[newIndex].color === 'lightgrey' &&
//         (isNearby(draggingIndex, newIndex) || draggingIndex === CENTER_INDEX)
//       ) {
//         swapItems(draggingIndex, newIndex);
//         swapHappened = true;
//       }

//       Animated.spring(dragPosition, {
//         toValue: { x: 0, y: 0 },
//         useNativeDriver: false,
//       }).start(() => {
//         setDraggingIndex(null);
//         if (swapHappened) {
//           setTurn((prevTurn) => (prevTurn === 'red' ? 'green' : 'red'));
//         }
//       });
//     },
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       <View style={[styles.grid, { width: GRID_SIZE, height: GRID_SIZE }]}>
//         {data.map((item, index) => (
//           <View key={index} style={[styles.cell, { width: CELL_SIZE, height: CELL_SIZE }]}>
//             {draggingIndex === index ? (
//               <Animated.View
//                 style={[
//                   styles.circle,
//                   {
                   
//                     backgroundColor: item.color,
//                     width: CIRCLE_SIZE,
//                     height: CIRCLE_SIZE,
//                     transform: dragPosition.getTranslateTransform(),
//                     zIndex: 10,
//                     shadowColor:'black',
//                     shadowOpacity:0.4,
//                     shadowOffset:{width:10,height:10},
//                     elevation: 10,
//                   },
//                 ]}
//                 {...panResponder.panHandlers}
//               />
//             ) : (
//               <Animated.View
//                 onTouchStart={() => {
//                   if (
//                     (item.color === 'red' || item.color === 'green') &&
//                     item.color === turn
//                   ) {
//                     setDraggingIndex(index);
//                   }
//                 }}
//                 style={[
//                   styles.circle,
//                   {
//                     backgroundColor: item.color,
//                     width: CIRCLE_SIZE,
//                     height: CIRCLE_SIZE,
//                     zIndex: 0,
//                     elevation: 1,
                   
//                     opacity: item.color === turn  ? 1 : 0.3,
//                   },
//                 ]}
//               />
//             )}
//           </View>
//         ))}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     alignItems:'center',
//     justifyContent:'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#ccc',
//   },
//   cell: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   circle: {
//     borderRadius: 100,
    
//   },
// });

// export default App;
