import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerShown: false,
        headerTintColor: '#fff',
        headerBackTitle: 'Back',
      }}
    />
  );
}