import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#010100",
        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#010100",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            animation: "slide_from_right",
            headerStyle: {
              backgroundColor: "#010100",
            },
            headerTitle: "SeeGull", // Set the header title to "Be My Eyes"
            headerTitleStyle: {
              color: "#fff", // Set the header title color to white
              fontWeight: "normal", // Make the header title bold
            },

            headerTitleAlign: "center", // Center the header title
            headerBackTitleVisible: false, // Hides the back button text, only icon is visible
            headerTintColor: "#010001", // Set the back button color to white
            // You might want to adjust the header's height or padding depending on your design needs
          }}
        />
        <Stack.Screen
          name="phoneNumber"
          options={{
            headerTitle: "",
          }}
        />
      </Stack>
    </View>
  );
}
