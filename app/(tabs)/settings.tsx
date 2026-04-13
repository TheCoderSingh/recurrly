import { Text, TouchableOpacity } from "react-native";

import { useAuth } from "@clerk/expo";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-[#081126] mb-8">
        Settings
      </Text>

      <TouchableOpacity
        onPress={() => signOut()}
        className="w-full bg-destructive/10 py-4 rounded-xl items-center flex-row justify-center border border-destructive/20"
      >
        <Text className="text-destructive font-sans-semibold text-lg">
          Sign out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;
