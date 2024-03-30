import Constants from "expo-constants";

/**
 * Determines the base URL for HTTP requests.
 * In development, it uses the host machine's IP address. In production, it should return the production API URL.
 */
export const getHttpBaseUrl = () => {
  // In development, use the local server's IP address
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    // In production, return your production API URL
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }

  return `http://${localhost}:3000`;
};

/**
 * Determines the base URL for WebSocket connections.
 * In development, it uses the host machine's IP address with the WebSocket protocol.
 * In production, it should return the production WebSocket URL.
 */
export const getWsBaseUrl = () => {
  // In development, use the WebSocket protocol with the local server's IP address
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    // In production, return your production WebSocket URL
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }

  return `ws://${localhost}:3000`;
};
