import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// import { TRPCProvider } from "~/utils/api"; // todo: setup query client

import "../styles.css";

import { PermissionsProvider } from "~/contexts/PermissionsContext";
import SessionProvider from "~/contexts/SessionsContext";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {

  return (
    <>
      {/* <TRPCProvider> */}
      {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
      <SessionProvider>
        <PermissionsProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <StatusBar />
        </PermissionsProvider>
      </SessionProvider>
      {/* </TRPCProvider> */}
    </>
  );
}
