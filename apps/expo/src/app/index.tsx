// import React, { useEffect } from "react";
// import { Redirect, SplashScreen } from "expo-router";
// import { useQueryClient } from "@tanstack/react-query";

// import { LoadingIndicatorOverlay } from "~/components";
// import { usePermissions } from "~/contexts/PermissionsContext";
// import { useSession } from "~/contexts/SessionsContext";

// const Index = () => {
//   const { isSignedIn, isLoading: sessionIsLoading } = useSession();
//   const { isLoading: permissionsIsLoading } = usePermissions();

//   useEffect(() => {
//     // When loading is complete, hide the splash screen
//     if (!sessionIsLoading && !permissionsIsLoading && !isSignedIn) {
//       void SplashScreen.hideAsync();
//     }
//   }, [sessionIsLoading, permissionsIsLoading, isSignedIn]);

//   if (sessionIsLoading || permissionsIsLoading) {
//     return <LoadingIndicatorOverlay />;
//   }

//   return isSignedIn ? <Redirect href="/app/" /> : <Redirect href="/auth/" />;
// };

// export default Index;

import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as ExpoAudioStreaming from "custom-native-modules/expo-audio-streaming/src/index";

import { BASE_64 } from "./base64";

export default function App() {
  useEffect(() => {
    const setup = async () => {
      try {
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

// import { Text, View } from "react-native";
// import { hello } from "modules/my-module";

// export default function App() {
//   return (
//     <View>
//       <Text>{hello()} world!</Text>
//     </View>
//   );
// }
