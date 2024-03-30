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

import { useeffect } from "react";
import { stylesheet, text, view } from "react-native";

import * as expoaudiostreaming from "expo-audio-streamer"
import { base_64 } from "./base64";

export default function app() {
  useeffect(() => {
    const setup = async () => {
      try {
        await expoaudiostreaming.init();
        console.log("audio streaming initialized");
        await new promise((resolve) => settimeout(resolve, 500));

        await expoaudiostreaming.appendaudio(base_64);
        console.log("audio appended");
        await new promise((resolve) => settimeout(resolve, 500));

        await expoaudiostreaming.appendaudio(base_64);
        console.log("audio appended 2");
      } catch (error) {
        console.error(error);
      }
    };

    void setup();
  }, []);

  return (
    <view style={styles.container}>
      <text>hello world!</text>
    </view>
  );
}

const styles = stylesheet.create({
  container: {
    flex: 1,
    backgroundcolor: "#fff",
    alignitems: "center",
    justifycontent: "center",
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
