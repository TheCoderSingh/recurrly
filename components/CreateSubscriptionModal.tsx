import { icons } from "@/constants/icons";
import { clsx } from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (subscription: any) => void;
}

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#f5c542",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#b8e8d0",
  Productivity: "#ffcdd2",
  Cloud: "#bbdefb",
  Music: "#c8e6c9",
  Other: "#d7ccc8",
};

export default function CreateSubscriptionModal({
  isOpen,
  onClose,
  onAdd,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Other");

  const handleSubmit = () => {
    const numPrice = parseFloat(price);
    if (!name.trim() || isNaN(numPrice) || numPrice <= 0) return;

    const startDate = dayjs().toISOString();
    const renewalDate = dayjs()
      .add(1, frequency === "Monthly" ? "month" : "year")
      .toISOString();

    const result = {
      id: name.toLowerCase().replace(/ /g, "-") + "-" + Date.now(),
      name: name.trim(),
      price: numPrice,
      frequency,
      billing: frequency,
      category,
      status: "active",
      startDate,
      renewalDate,
      icon: icons.plus,
      color: CATEGORY_COLORS[category] || "#d7ccc8",
      currency: "USD", // default currency
    };

    onAdd(result);
    // Reset form
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
    onClose();
  };

  const isFormValid = name.trim().length > 0 && parseFloat(price) > 0;

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <Pressable className="modal-overlay" onPress={onClose} />
        <View className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable onPress={onClose} className="modal-close">
              <Text className="modal-close-text">✕</Text>
            </Pressable>
          </View>

          <ScrollView className="modal-body" contentContainerClassName="gap-5">
            <View className="auth-field">
              <Text className="auth-label">Name</Text>
              <TextInput
                className="auth-input"
                placeholder="e.g. Netflix"
                placeholderTextColor="rgba(0,0,0,0.5)"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Price</Text>
              <TextInput
                className="auth-input"
                placeholder="0.00"
                placeholderTextColor="rgba(0,0,0,0.5)"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Frequency</Text>
              <View className="picker-row">
                <Pressable
                  onPress={() => setFrequency("Monthly")}
                  className={clsx(
                    "picker-option",
                    frequency === "Monthly" && "picker-option-active",
                  )}
                >
                  <Text
                    className={clsx(
                      "picker-option-text",
                      frequency === "Monthly" && "picker-option-text-active",
                    )}
                  >
                    Monthly
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setFrequency("Yearly")}
                  className={clsx(
                    "picker-option",
                    frequency === "Yearly" && "picker-option-active",
                  )}
                >
                  <Text
                    className={clsx(
                      "picker-option-text",
                      frequency === "Yearly" && "picker-option-text-active",
                    )}
                  >
                    Yearly
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="auth-field">
              <Text className="auth-label">Category</Text>
              <View className="category-scroll">
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={clsx(
                      "category-chip",
                      category === cat && "category-chip-active",
                    )}
                  >
                    <Text
                      className={clsx(
                        "category-chip-text",
                        category === cat && "category-chip-text-active",
                      )}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={!isFormValid}
              className={clsx(
                "auth-button",
                !isFormValid && "auth-button-disabled",
                "mb-5",
              )}
            >
              <Text className="auth-button-text">Add Subscription</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
