import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();
  const [stepGoal, setStepGoal] = useState<number | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === null) {
        await AsyncStorage.setItem("hasLaunched", "true");
        setIsFirstLaunch(true);
        router.push("/onboarding/intro-screen");
      } else {
        setIsFirstLaunch(false);
        router.push("/tabs");
      }
    } catch (error) {
      console.error("Error checking first launch:", error);
    }
  };

  const loadSettings = async () => {
    try {
      const savedStepGoal = await AsyncStorage.getItem("stepGoal");
      const savedDonationAmount = await AsyncStorage.getItem("donationAmount");

      if (savedStepGoal) setStepGoal(parseInt(savedStepGoal, 10));
      if (savedDonationAmount) setDonationAmount(parseFloat(savedDonationAmount));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  return <Stack screenOptions={{ headerShown: false }} />;
}
