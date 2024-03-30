import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

// import { api } from "~/utils/api";

interface SessionContextType {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
//   deleteAccount: () => Promise<void>;
  signInWithPhoneNumber: (
    phoneNumber: string,
  ) => Promise<FirebaseAuthTypes.ConfirmationResult | null>;
  signInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<FirebaseAuthTypes.UserCredential| null>;
  signInWithGoogle: () => (Promise<FirebaseAuthTypes.UserCredential | null>);
  verifyPhoneNumberOTP: (
    otp: string,
  ) => Promise<FirebaseAuthTypes.UserCredential | null>; // Updated signature
}

GoogleSignin.configure({
  webClientId: "903192435204-lbsl7o92lo277oru4ilcokk4p2pejdce.apps.googleusercontent.com"
})

interface SessionProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<SessionContextType | undefined>(undefined);

const SessionProvider = ({ children }: SessionProviderProps) => {

  const router = useRouter();

//   const deleteUser = api.auth.deleteUser.useMutation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const isSignedIn = !!user;

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      // console.log("Auth state changed:", authUser);
      setUser(authUser);
      setIsLoading(false);
      
      // Redirect on Sign out
      if (!authUser){
        router.replace("/auth/");
      }
    });

    return unsubscribe;
  }, []);

  const signInWithPhoneNumber = async (phoneNumber: string) => {
    const result = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirmationResult(result);

    return result;
  };

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    
    const result = await auth().signInWithEmailAndPassword(email, password);

    return result;
  };

  const signInWithGoogle = async () => {
   // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog:true});
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential); 
  };

  const verifyPhoneNumberOTP = async (otp: string) => {
    if (!confirmationResult) {
      throw new Error("No confirmation result available for OTP verification.");
    }

    return await confirmationResult.confirm(otp);
  };

  const signOut = async () => {
    await auth().signOut();
    setUser(null);
  };

//   const deleteAccount = async () => {
//     await deleteUser.mutateAsync();
//     setUser(null);
//   };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn,
        // deleteAccount,
        signOut,
        signInWithPhoneNumber,
        signInWithEmailAndPassword,
        signInWithGoogle,
        verifyPhoneNumberOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};

export default SessionProvider;