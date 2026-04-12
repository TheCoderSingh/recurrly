import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SignIn = () => {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showMfaInput, setShowMfaInput] = useState(false);

  const onSignInPress = async () => {
    setErrorMsg("");
    if (!emailAddress || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        if (__DEV__) {
          console.error(JSON.stringify(error, null, 2));
        }
        setErrorMsg(error.message || "Sign in failed.");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            router.replace("/(tabs)");
          },
        });
      } else if (signIn.status === "needs_second_factor") {
        try {
          await signIn.mfa.sendEmailCode();
          setShowMfaInput(true);
          setErrorMsg("");
        } catch (mfaError: any) {
          setErrorMsg(mfaError.message || "Failed to send MFA code.");
        }
      } else if (signIn.status === "needs_client_trust") {
        try {
          await signIn.mfa.sendEmailCode();
          setShowMfaInput(true);
          setErrorMsg("");
        } catch (trustError: any) {
          setErrorMsg(trustError.message || "Failed to send verification code.");
        }
      } else {
        setErrorMsg("Additional verification needed.");
      }
    } catch (err: any) {
      if (__DEV__) {
        console.error(JSON.stringify(err, null, 2));
      }
      setErrorMsg(err.errors?.[0]?.message || "Something went wrong.");
    }
  };

  const onVerifyMfaPress = async () => {
    setErrorMsg("");
    if (!mfaCode) {
      setErrorMsg("Please enter the MFA code.");
      return;
    }

    try {
      await signIn.mfa.attemptSecondFactor({ code: mfaCode });

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            router.replace("/(tabs)");
          },
        });
      } else {
        setErrorMsg("MFA verification incomplete.");
      }
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || "Invalid MFA code.");
    }
  };

  const loading = fetchStatus === "fetching";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 py-12"
      >
        <View className="flex-1 justify-center">
          <View className="items-center mb-10">
            <View className="flex-row items-center justify-center space-x-2">
              <View className="w-12 h-12 bg-accent rounded-xl items-center justify-center mr-3">
                <Text className="text-white text-2xl font-sans-bold">R</Text>
              </View>
              <View>
                <Text className="text-2xl font-sans-bold text-[#081126]">
                  Recurrly
                </Text>
                <Text className="text-xs font-sans-medium text-gray-500 uppercase tracking-widest">
                  Smart Billing
                </Text>
              </View>
            </View>
          </View>

          <View className="items-center mb-8">
            <Text className="text-3xl font-sans-bold text-[#081126] mb-2">
              Welcome back
            </Text>
            <Text className="text-base font-sans-regular text-gray-600 text-center">
              Sign in to continue managing your subscriptions
            </Text>
          </View>

          <View className="bg-card rounded-3xl p-6 border border-black/5 shadow-sm">
            {errorMsg ? (
              <View className="bg-destructive/10 p-4 rounded-xl mb-5">
                <Text className="text-destructive font-sans-semibold text-sm text-center">
                  {errorMsg}
                </Text>
              </View>
            ) : null}
            {showMfaInput ? (
              <>
                <View className="mb-6">
                  <Text className="text-[#081126] font-sans-semibold text-base mb-2">
                    MFA Code
                  </Text>
                  <TextInput
                    value={mfaCode}
                    placeholder="Enter MFA code"
                    className="w-full bg-muted rounded-xl px-4 py-4 text-[#081126] font-sans-regular text-base border-transparent focus:border-accent border"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setMfaCode}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>
                <TouchableOpacity
                  onPress={onVerifyMfaPress}
                  disabled={loading}
                  className={`w-full bg-accent py-4 rounded-xl items-center flex-row justify-center ${loading ? "opacity-70" : ""}`}
                >
                  {loading ? (
                    <ActivityIndicator color="white" className="mr-2" />
                  ) : null}
                  <Text className="text-white font-sans-semibold text-lg">
                    Verify MFA
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View className="mb-5">
                  <Text className="text-[#081126] font-sans-semibold text-base mb-2">
                    Email
                  </Text>
                  <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter your email"
                    className="w-full bg-muted rounded-xl px-4 py-4 text-[#081126] font-sans-regular text-base border-transparent focus:border-accent border"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setEmailAddress}
                    keyboardType="email-address"
                    editable={!loading}
                  />
                </View>
                <View className="mb-6">
                  <Text className="text-[#081126] font-sans-semibold text-base mb-2">
                    Password
                  </Text>
                  <TextInput
                    value={password}
                    placeholder="Enter your password"
                    className="w-full bg-muted rounded-xl px-4 py-4 text-[#081126] font-sans-regular text-base border-transparent focus:border-accent border"
                    secureTextEntry={true}
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setPassword}
                    editable={!loading}
                  />
                </View>
                <TouchableOpacity
                  onPress={onSignInPress}
                  disabled={loading}
                  className={`w-full bg-accent py-4 rounded-xl items-center flex-row justify-center ${loading ? "opacity-70" : ""}`}
                >
                  {loading ? (
                    <ActivityIndicator color="white" className="mr-2" />
                  ) : null}
                  <Text className="text-white font-sans-semibold text-lg">
                    Sign in
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <View className="flex-row items-center justify-center mt-6">
              <Text className="font-sans-regular text-[#081126]/60 text-base">
                New to Recurrly?{" "}
              </Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="font-sans-semibold text-accent text-base">
                    Create an account
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;