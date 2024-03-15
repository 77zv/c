import { Alert, Linking, StyleSheet, View, Text } from "react-native";
import * as Camera from "expo-camera";
import * as Contacts from "expo-contacts";
import { PermissionStatus } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

import { useSession } from "~/contexts/SessionsContext";
import { usePermissions } from "../../contexts/PermissionsContext";

const Permissions = () => {
  const router = useRouter();
  const { isSignedIn } = useSession();
  const { permissions, checkPermissions } = usePermissions();

  const openSettings = async () => {
    await Linking.openSettings();
  };

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== PermissionStatus.GRANTED) {
      Alert.alert(
        "Camera Permission",
        "Camera permission is required for this app. Please enable it in your device settings.",
        [{ text: "Open Settings", onPress: void openSettings }],
      );
    }
    await checkPermissions();
  };

  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== PermissionStatus.GRANTED) {
      Alert.alert(
        "Contacts Permission",
        "Contacts permission is required for this app. Please enable it in your device settings.",
        [{ text: "Open Settings", onPress: void openSettings }],
      );
    }
    await checkPermissions();
  };

  const requestNotificationsPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== PermissionStatus.GRANTED) {
      Alert.alert(
        "Notifications Permission",
        "Notifications permission is required for this app. Please enable it in your device settings.",
        [{ text: "Open Settings", onPress: void openSettings }],
      );
    }
    await checkPermissions();
  };

  const onPress = () => {
    isSignedIn ? router.push("/(app)/") : router.push("/(auth)/signup");
  };

  const requiredPermissions = permissions.camera && permissions.contacts;

  return (
    <View>
      <View>
        <Text>Permissions</Text>
        <Text>
          This app requires certain permissions to function properly. Please
          allow the necessary permissions to continue.
        </Text>
      </View>

      <View>
        <Text>Camera</Text>
        <Checkbox
          onPress={requestCameraPermission}
          checked={permissions.camera}
          disabled={permissions.camera}
        >
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
      </View>

      <View>
        <Text>Contacts</Text>
        <Checkbox
          onPress={requestContactsPermission}
          checked={permissions.contacts}
          disabled={permissions.contacts}
        >
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
      </View>

      <View>
        <Text>Notifications</Text>
        <Checkbox
          onPress={requestNotificationsPermission}
          checked={permissions.notifications}
          disabled={permissions.notifications}
        >
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
      </View>

      <Button onPress={onPress} disabled={!requiredPermissions}>
        <Text>Continue</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  permissionItem: {
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Permissions;
