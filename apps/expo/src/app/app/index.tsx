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
import { Audio } from "expo-av";
import Voice from "@react-native-voice/voice";
import { z } from "zod";

import { api } from "~/api";

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

type Alignment = z.infer<typeof AlignmentSchema>;
type AudioData = z.infer<typeof AudioDataSchema>;

export { AudioDataSchema, AlignmentSchema };
export type { Alignment, AudioData };

const randomUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// const CLIENT_ID = randomUUID();
// const WEBSOCKET_URL = `ws://172.31.144.1:3000/listen-to-prompt-response/${CLIENT_ID}`;

const WEBSOCKET_BASE_URL = "ws://172.31.144.1:3000/listen-to-prompt-response/";

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

  // const [audioQueue, setAudioQueue] = useState<(string | null | undefined)[]>(
  //   [],
  // );
  // const [isPlaying, setIsPlaying] = useState(false);

  // useEffect(() => {
  //   const ws = new WebSocket(WEBSOCKET_URL);
  //   void AudioStreamer.init();

  //   ws.onopen = () => {
  //     console.log("WebSocket Connection opened!");
  //   };

  //   ws.onmessage = (e: MessageEvent<string>) => {
  //     // Handle incoming messages
  //     const parsedData = AudioDataSchema.parse(JSON.parse(e.data));
  //     console.log("Parsed Data: ", parsedData);
  //     if (parsedData.audio) {
  //       void AudioStreamer.appendAudio(parsedData.audio);
  //       setAudioQueue((currentQueue) => [...currentQueue, parsedData.audio]);
  //     }
  //   };

  //   ws.onerror = (e) => {
  //     console.error(e);
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket Connection closed!");
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, []);

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

      void processSpeechToLLM(bestMatch); // Process the final speech result
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

  const processSpeechToLLM = useCallback(
    async (text: string) => {
      const clientId = randomUUID();

      void AudioStreamer.init();

      const ws = new WebSocket(`${WEBSOCKET_BASE_URL}${clientId}`);

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

      ws.onmessage = (e: MessageEvent<string>) => {
        const parsedData = AudioDataSchema.parse(JSON.parse(e.data));
        if (parsedData.audio) {
          void AudioStreamer.appendAudio(parsedData.audio);
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
