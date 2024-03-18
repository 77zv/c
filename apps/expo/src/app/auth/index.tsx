import React, { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, View, TextInput, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from '~/contexts/SessionsContext';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { router } from 'expo-router';

const Index = () => {
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  interface Input {
    _phoneNumber: string,  
    _code: string
  }

  const { control, handleSubmit, setError, formState: { errors } } = useForm({
    defaultValues: {
      _phoneNumber: '',
      _code: '',
    },
  });
  const session = useSession();

  const onPhoneNumberSubmit = async ({_phoneNumber: phoneNumber, _code}: Input) => {
    const confirmation = await session.signInWithPhoneNumber(phoneNumber);
    if (confirmation) {
      setConfirm(confirmation);
    } else {
      // Handle the case where confirmation is null (sign in failed)
      setError('_phoneNumber', {
        type: 'manual',
        message: 'Failed to send OTP. Please try again.',
      });
    }
  };

  const onOtpSubmit = async ({_phoneNumber, _code: code}: Input) => {
    try {
      await confirm?.confirm(code);
      // router.push("/auth/permissions");
      router.replace("/app/");
    } catch (error) {
      setError('_code', {
        type: 'manual',
        message: 'Invalid code. Please try again.',
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
          <Text>Enter your phone number</Text>
          <Controller
            control={control}
            rules={{ required: 'Phone number is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Phone Number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{ marginBottom: 10, borderWidth: 1, borderColor: '#cccccc', padding: 10 }}
              />
            )}
            name="_phoneNumber"
          />
          {errors._phoneNumber && <Text>{errors._phoneNumber.message}</Text>}
          <Button title="Send OTP" onPress={handleSubmit(onPhoneNumberSubmit)} />
        </View>
      ) : (
        <View style={{ width: "80%" }}>
          <Text>Enter the OTP</Text>
          <Controller
            control={control}
            rules={{ required: 'OTP is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="OTP"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                style={{ marginBottom: 10, borderWidth: 1, borderColor: '#cccccc', padding: 10 }}
              />
            )}
            name="_code"
          />
          {errors._code && <Text>{errors._code.message}</Text>}
          <Button title="Verify OTP" onPress={handleSubmit(onOtpSubmit)} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Index;
