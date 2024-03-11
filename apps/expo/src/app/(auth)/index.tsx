import { Button, KeyboardAvoidingView, Platform, View, TextInput, Text } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "~/contexts/SessionsContext";

const Start = () => {
  const router = useRouter();

  const session = useSession();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: ""
    },
  });
  const onSubmit = async (data: string) => {
   const result = await session.signInWithPhoneNumber(data);

   if (result) {
    result.confirm('123456')

   }
    router.push("/(auth)/otp")
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View
        style={{ width: "80%", justifyContent: "space-around", height: 100 }}
      >
        <View>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Phone Number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="phoneNumber"
          />
          {errors.phoneNumber && <Text>This is required.</Text>}

          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Start;
