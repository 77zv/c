import type {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
  SpeechVolumeChangeEvent,
} from "@react-native-voice/voice";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import Voice from "@react-native-voice/voice";

interface State {
  recognized: boolean;
  pitch: number;
  error: string;
  end: boolean;
  started: boolean;
  results: string[];
  partialResults: string[];
}

const VoiceTest = () => {
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
      processSpeechToLLM(state.results.join(" ")); // Process the final speech result
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

  const processSpeechToLLM = useCallback((_text: string) => {
    // todo: implement backend
  }, []);

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
      ></TouchableHighlight>
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

export default VoiceTest;
