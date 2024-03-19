import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Controller, useForm } from "react-hook-form";

import { useSession } from "~/contexts/SessionsContext";

const PhoneNumber = () => {
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  interface Input {
    _phoneNumber: string;
    _code: string;
  }

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _phoneNumber: "",
      _code: "",
    },
  });
  const session = useSession();

  const onPhoneNumberSubmit = async ({
    _phoneNumber: phoneNumber,
    _code,
  }: Input) => {
    const confirmation = await session.signInWithPhoneNumber(phoneNumber);
    if (confirmation) {
      setConfirm(confirmation);
    } else {
      // Handle the case where confirmation is null (sign in failed)
      setError("_phoneNumber", {
        type: "manual",
        message: "Failed to send OTP. Please try again.",
      });
    }
  };

  const onOtpSubmit = async ({ _phoneNumber, _code: code }: Input) => {
    try {
      await confirm?.confirm(code);
      // router.push("/auth/permissions");
      router.replace("/app/");
    } catch (error) {
      setError("_code", {
        type: "manual",
        message: "Invalid code. Please try again.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      {!confirm ? (
        <View style={{ width: "80%" }}>
          <Controller
            control={control}
            rules={{ required: "Phone number is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Phone Number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.inputField}
              />
            )}
            name="_phoneNumber"
          />
          {errors._phoneNumber && <Text>{errors._phoneNumber.message}</Text>}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onPhoneNumberSubmit)}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: "80%" }}>
          <Text>Enter the OTP</Text>
          <Controller
            control={control}
            rules={{ required: "OTP is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="OTP"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                style={styles.inputField}
              />
            )}
            name="_code"
          />
          {errors._code && <Text>{errors._code.message}</Text>}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onOtpSubmit)}
          >
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  inputField: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 10,
    borderRadius: 50, // Increase border radius for rounder corners
    width: "100%", // Use 100% of the parent View width
  },
  button: {
    backgroundColor: "#0962F6", // Bright blue background for buttons
    paddingVertical: 15, // Add vertical padding
    paddingHorizontal: 10, // Add horizontal padding for better touch area
    borderRadius: 20, // Match borderRadius of inputField for consistency
    width: "100%", // Match the width with inputField
    marginBottom: 10, // Add bottom margin
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
  },
  buttonText: {
    color: "white",
    fontSize: 20, // Adjust as needed
    fontWeight: "bold",
  },
});

export default PhoneNumber;