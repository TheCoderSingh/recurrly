import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { usePostHog } from "posthog-react-native";
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

const SignUp = () => {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const posthog = usePostHog();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loading = fetchStatus === "fetching";

  const onSignUpPress = async () => {
    setErrorMsg("");
    if (!emailAddress || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        if (__DEV__) {
          console.error(JSON.stringify(error, null, 2));
        }
        posthog.capture("user_sign_up_failed", {
          error_message: error.message,
        });
        setErrorMsg(error.message || "Sign up failed");
        return;
      }

      await signUp.verifications.sendEmailCode();
    } catch (err: any) {
      if (__DEV__) {
        console.error(JSON.stringify(err, null, 2));
      }
      posthog.capture("user_sign_up_failed", {
        error_message: err.errors?.[0]?.message,
      });
      setErrorMsg(err.errors?.[0]?.message || "Something went wrong.");
    }
  };

  const onPressVerify = async () => {
    setErrorMsg("");
    if (!code) {
      setErrorMsg("Please enter the verification code");
      return;
    }

    try {
      await signUp.verifications.verifyEmailCode({ code });

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            posthog.identify(emailAddress, {
              $set: { email: emailAddress },
              $set_once: { signup_date: new Date().toISOString() },
            });
            posthog.capture("user_signed_up", { method: "email" });
            router.replace("/(tabs)");
          },
        });
      } else {
        if (__DEV__) {
          console.error(JSON.stringify(signUp, null, 2));
        }
        setErrorMsg("Sign up attempt not complete");
      }
    } catch (err: any) {
      if (__DEV__) {
        console.error(JSON.stringify(err, null, 2));
      }
      posthog.capture("user_sign_up_failed", {
        error_message: err.errors?.[0]?.message,
        stage: "email_verification",
      });
      setErrorMsg(err.errors?.[0]?.message || "Invalid code.");
    }
  };

  if (
    signUp?.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
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
            <View className="items-center mb-8">
              <Text className="text-3xl font-sans-bold text-[#081126] mb-2">
                Verify email
              </Text>
              <Text className="text-base font-sans-regular text-gray-600 text-center">
                We&apos;ve sent a verification code to {emailAddress}
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
              <View className="mb-6">
                <Text className="text-[#081126] font-sans-semibold text-base mb-2">
                  Verification Code
                </Text>
                <TextInput
                  value={code}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-muted rounded-xl px-4 py-4 text-[#081126] font-sans-regular text-base border-transparent focus:border-accent border"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  onChangeText={setCode}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                onPress={onPressVerify}
                disabled={loading}
                className={`w-full bg-accent py-4 rounded-xl items-center flex-row justify-center ${loading ? "opacity-70" : ""}`}
              >
                {loading ? (
                  <ActivityIndicator color="white" className="mr-2" />
                ) : null}
                <Text className="text-white font-sans-semibold text-lg">
                  Verify & Continue
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  try {
                    await signUp.verifications.sendEmailCode();
                    setErrorMsg("");
                  } catch (err: any) {
                    if (__DEV__) {
                      console.error(err);
                    }
                    setErrorMsg(err.errors?.[0]?.message || "Failed to resend code.");
                  }
                }}
                disabled={loading}
                className="mt-4"
              >
                <Text className="text-accent font-sans-semibold text-center text-base">
                  Resend Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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
              Create account
            </Text>
            <Text className="text-base font-sans-regular text-gray-600 text-center">
              Start managing all your subscriptions effortlessly
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
                placeholder="Create a password"
                className="w-full bg-muted rounded-xl px-4 py-4 text-[#081126] font-sans-regular text-base border-transparent focus:border-accent border"
                secureTextEntry={true}
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            <View nativeID="clerk-captcha" className="mb-4" />

            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={loading}
              className={`w-full bg-accent py-4 rounded-xl items-center flex-row justify-center ${loading ? "opacity-70" : ""}`}
            >
              {loading ? (
                <ActivityIndicator color="white" className="mr-2" />
              ) : null}
              <Text className="text-white font-sans-semibold text-lg">
                Sign up
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center justify-center mt-6">
              <Text className="font-sans-regular text-[#081126]/60 text-base">
                Already have an account?{" "}
              </Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="font-sans-semibold text-accent text-base">
                    Sign in
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

export default SignUp;