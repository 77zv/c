import React, { useEffect } from "react";
import { Redirect, SplashScreen } from "expo-router";

import { LoadingIndicatorOverlay } from "~/components";
import { usePermissions } from "~/contexts/PermissionsContext";
import { useSession } from "~/contexts/SessionsContext";

const Index = () => {
  const { isSignedIn, isLoading: sessionIsLoading } = useSession();
  const { isLoading: permissionsIsLoading } = usePermissions();

  useEffect(() => {
    // When loading is complete, hide the splash screen
    if (!sessionIsLoading && !permissionsIsLoading && !isSignedIn) {
      void SplashScreen.hideAsync();
    }
  }, [sessionIsLoading, permissionsIsLoading, isSignedIn]);

  if (sessionIsLoading || permissionsIsLoading) {
    return <LoadingIndicatorOverlay />;
  }

  return isSignedIn ? (
    <Redirect href="/(app)" />
  ) : (
    <Redirect href="/(auth)" />
  );
};

export default Index;