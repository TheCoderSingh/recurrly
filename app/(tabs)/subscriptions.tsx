import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { useFocusEffect } from "expo-router";
import { styled } from "nativewind";
import { useCallback, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [data, setData] = useState([...HOME_SUBSCRIPTIONS]);

  useFocusEffect(
    useCallback(() => {
      setData([...HOME_SUBSCRIPTIONS]);
    }, []),
  );

  const filteredSubscriptions = data.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-bold mb-4 text-foreground">
        Subscriptions
      </Text>

      <View className="mb-4">
        <TextInput
          className="bg-card text-foreground px-4 py-3 rounded-lg border border-border"
          placeholder="Search subscriptions..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="never"
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={{ paddingBottom: 20, gap: 12 }}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
            }
          />
        )}
        ListEmptyComponent={
          <Text className="text-center text-muted-foreground mt-10">
            No subscriptions found.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
