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
import * as AudioStreamer from "expo-audio-streamer";
import * as Crypto from "expo-crypto";
import Voice from "@react-native-voice/voice";
import { z } from "zod";

import { api } from "~/api";
import { getWsBaseUrl } from "~/utils/ip";

const AlignmentSchema = z.object({
  char_start_times_ms: z.array(z.number()).optional(),
  chars_durations_ms: z.array(z.number()).optional(),
  chars: z.array(z.string()).optional(),
});

const AudioDataSchema = z.object({
  audio: z.string().optional().nullable(),
  isFinal: z.boolean().optional().nullable(),
  normalizedAlignment: AlignmentSchema.optional().nullable(),
  alignment: AlignmentSchema.optional().nullable(),
});

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
      setState((prevState) => ({
        ...prevState,
        end: true,
        results: e.value ?? [],
      }));

      if (e.value === undefined) return;
      if (e.value.length === 0) return;

      const bestMatch = e.value[0];

      if (bestMatch === undefined) return;

      void startPromptSession(bestMatch); // Process the final speech result
    };

    const onSpeechPartialResults = (e: SpeechResultsEvent) => {
      console.log("onSpeechPartialResults: ", e);
      setState((prevState) => ({
        ...prevState,
        partialResults: e.value ?? [],
      }));
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

  const startPromptSession = useCallback(
    (text: string) => {
      const clientId = Crypto.randomUUID();

      void AudioStreamer.init();

      const wsUrl = `${getWsBaseUrl()}/listen-to-prompt-response/${clientId}`;
      const ws = new WebSocket(wsUrl);

      const cleanupWebSocket = () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };

      ws.onopen = async () => {
        console.log("WebSocket Connection opened!");

        await promptModel.query({
          body: { clientId, promptData: { text } },
        });
      };

      ws.onmessage = async (e: MessageEvent<string>) => {
        const parsedData = AudioDataSchema.parse(JSON.parse(e.data));
        if (parsedData.audio) {
          await AudioStreamer.appendAudio(parsedData.audio);
        }
      };

      ws.onerror = (e) => {
        console.error(e);
        cleanupWebSocket();
      };

      ws.onclose = () => {
        console.log("WebSocket Connection closed!");
        cleanupWebSocket();
      };
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
