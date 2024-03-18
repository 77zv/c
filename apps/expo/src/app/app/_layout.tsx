// import { Slot, Redirect } from "expo-router";
// import { View } from "react-native";

// import { usePermissions } from "~/contexts/PermissionsContext";
// import { useSession } from "~/contexts/SessionsContext";

// const AppLayout = () => {
//   const { permissions } = usePermissions();
//   const { isLoading: sessionIsLoading, isSignedIn } = useSession();

//   const requiredPermissions =
//     permissions.camera && permissions.contacts && permissions.notifications;

// //   if (sessionIsLoading ) {
// //     // return <LoadingIndicatorOverlay />;
// //   }

//   if (!isSignedIn) {
//     return <Redirect href="/auth/" />;
//   }


// //   if (!requiredPermissions) {
// //     return <Redirect href="/auth/permissions" />;
// //   }

//   return (
//     <Slot/>
//   );
// };

// export default AppLayout;