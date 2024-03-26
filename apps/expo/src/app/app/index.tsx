import type {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
  SpeechVolumeChangeEvent,
} from "@react-native-voice/voice";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Voice from "@react-native-voice/voice";

import { api } from "~/api";

const randomUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const CLIENT_ID = randomUUID();
const WEBSOCKET_URL = `ws://172.26.96.1:3000/listen-to-prompt-response/${CLIENT_ID}`;

interface State {
  recognized: boolean;
  pitch: number;
  error: string;
  end: boolean;
  started: boolean;
  results: string[];
  partialResults: string[];
}

const Home = () => {
  const promptModel = api.ref("[POST]/prompt-ai-model");

  const [state, setState] = useState<State>({
    recognized: false,
    pitch: 0,
    error: "",
    end: false,
    started: false,
    results: [],
    partialResults: [],
  });

  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(WEBSOCKET_URL);
    ws.onopen = () => {
      console.log("WebSocket Connection opened!");
    };
    ws.onmessage = (e: MessageEvent<string>) => {
      // Handle incoming messages
      console.log(e.data);
    };
    ws.onerror = (e) => {
      // Handle errors
      console.error(e);
    };
    ws.onclose = () => {
      console.log("WebSocket Connection closed!");
    };

    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const onSpeechStart = (e: SpeechStartEvent) => {
      console.log("onSpeechStart: ", e);
      setState((prevState) => ({ ...prevState, started: true }));
    };

    const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
      console.log("onSpeechRecognized: ", e);
      setState((prevState) => ({ ...prevState, recognized: true }));
    };

    const onSpeechEnd = (e: SpeechEndEvent) => {
      console.log("onSpeechEnd: ", e);
      setState((prevState) => ({ ...prevState, end: true }));
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
      console.log("onSpeechError: ", e);
      setState((prevState) => ({
        ...prevState,
        error: JSON.stringify(e.error),
      }));
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
      console.log("onSpeechResults: ", e);
      setState((prevState) => ({ ...prevState, results: e.value ?? [] }));
    };

    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      console.log("onSpeechPartialResults: ", e);
      setState((prevState) => ({
        ...prevState,
        end: true,
        partialResults: e.value ?? [],
      }));

      if (e.value === undefined) return;
      if (e.value.length === 0) return;

      const bestMatch = e.value[0];

      if (bestMatch === undefined) return;

      void processSpeechToLLM(bestMatch); // Process the final speech result
    };

    const onSpeechVolumeChanged = (e: SpeechVolumeChangeEvent) => {
      console.log("onSpeechVolumeChanged: ", e);
      setState((prevState) => ({
        ...prevState,
        pitch: e.value ?? 0,
      }));
    };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      const cleanUpVoice = async () => {
        await Voice.destroy();
        Voice.removeAllListeners();
      };

      void cleanUpVoice();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processSpeechToLLM = useCallback(
    async (text: string) => {
      await promptModel.query({
        body: { clientId: CLIENT_ID, promptData: { text } },
      });
    },
    [promptModel],
  );

  const startRecognizing = async () => {
    setState({
      recognized: false,
      pitch: 0,
      error: "",
      end: false,
      started: false,
      results: [],
      partialResults: [],
    });

    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
      <Text style={styles.instructions}>
        Press and hold the button, then speak.
      </Text>
      <TouchableHighlight
        onPressIn={startRecognizing}
        onPressOut={stopRecognizing}
        style={styles.button}
        underlayColor="#DDDDDD"
      >
        <Text>Record</Text>
      </TouchableHighlight>
      {/* Display transcription results */}
      {state.results.map((result, index) => (
        <Text key={`result-${index}`} style={styles.stat}>
          {result}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  stat: {
    textAlign: "center",
    color: "#B0171F",
    marginBottom: 1,
  },
});

export default Home;
