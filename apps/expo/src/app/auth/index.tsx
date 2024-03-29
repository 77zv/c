// import { useRouter } from "expo-router";
// import React from "react";
// import {
//   Dimensions,
//   // Image,
//   // ImageBackground,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const screenWidth = Dimensions.get("window").width;

// const BeMyEyesScreen = () => {

//   const router = useRouter();

//   return (
//     // <ImageBackground
//     //   source={{
//     //     uri: "https://cdn.discordapp.com/attachments/1002773521975480371/1219337465354256544/Untitled_design_4.png?ex=660aef81&is=65f87a81&hm=3e095fed8bbd168c9a9911aa8be15c2674e3a83a98d45a9fcc8ad2771c8dcd90&",
//     //   }}
//     //   style={styles.backgroundImage}
//     // >
//       <View style={styles.container}>
//         <Text style={styles.title}>Title</Text>
//         <Text style={styles.subheading}>SubHeading</Text>

//         {/* <Image
//           source={{
//             uri: "https://media.discordapp.net/attachments/1002773521975480371/1219327063664889886/00ce5ea46391853a9659121561a7d5aa-flat-eye-icon.png?ex=660ae5d1&is=65f870d1&hm=80139ac1b2f8cfb0f0f7d7607f112240b09c35fec72c43b4a9821402c253e979&=&format=webp&quality=lossless&width=619&height=619",
//           }}
//           style={styles.eyeImage}
//         /> */}

//         <View style={styles.statisticsContainer}>
//           {/* <Text style={styles.statisticsText}>615,165 Blind</Text>
//           <Text style={styles.statisticsText}>7,287,399 Volunteers</Text> */}
//         </View>

//         <TouchableOpacity style={[styles.button, styles.firstButton]} onPress={() => router.push("/auth/phoneNumber")}>
//           <Text style={styles.buttonText}>Get Started</Text>
//           {/* <Text style={styles.buttonSubtitle}>Enter your phone number to get started</Text> */}
//         </TouchableOpacity>
 
//       </View>
//     // </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     width: "100%", // Ensure it covers the whole screen width
//     height: "100%", // Ensure it covers the whole screen height
//   },

//   container: {
//     flex: 1,
//     backgroundColor: "#010100", // Dark blue background
//     alignItems: "center",
//     justifyContent: "space-around", // Space the items out evenly
//     paddingVertical: 20, // Add vertical padding
//   },
//   headerText: {
//     color: "white",
//     fontSize: 24, // You can adjust the size as needed
//     fontWeight: "bold",
//   },
//   title: {
//     color: "white",
//     fontSize: 35, // Keep the size for the title
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: -10, // Reduce the space below the title
//   },
//   subheading: {
//     color: "white",
//     fontSize: 24, // Smaller size for the subheading
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: -10, // Reduce the space above the subheading
//   },
//   eyeImage: {
//     width: screenWidth, // Adjust as needed
//     height: 200, // Adjust as needed
//     resizeMode: "contain", // Keep the aspect ratio
//   },
//   statisticsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingHorizontal: 40, // Add horizontal padding
//   },
//   statisticsText: {
//     color: "white",
//     fontSize: 18, // Adjust as needed
//   },
//   button: {
//     backgroundColor: "#0962F6", // Bright blue background for buttons
//     padding: 15, // Add padding
//     borderRadius: 10, // Round the corners
//     width: "80%", // Set the width
//     marginBottom: 10, // Add bottom margin to the first button
//     alignItems: "center", // Center text horizontally
//   },
//   firstButton: {
//     marginTop: 10, // Add top margin to the first button
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 20, // Adjust as needed
//     fontWeight: "bold",
//   },
//   buttonSubtitle: {
//     color: "white",
//     fontSize: 16, // Adjust as needed
//   },
// });

// export default BeMyEyesScreen;

import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as ExpoAudioStreaming from "modules/expo-audio-streaming/src/index";

import { BASE_64 } from "../base64";

export default function App() {
  useEffect(() => {
    const setup = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await ExpoAudioStreaming.init();
        console.log("Audio streaming initialized");
        await new Promise((resolve) => setTimeout(resolve, 500));

        await ExpoAudioStreaming.appendAudio(BASE_64);
        console.log("Audio appended");
        await new Promise((resolve) => setTimeout(resolve, 500));

        await ExpoAudioStreaming.appendAudio(BASE_64);
        console.log("Audio appended 2");
      } catch (error) {
        console.error(error);
      }
    };

    void setup();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

