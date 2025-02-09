import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StepGoal() {
  const [stepGoal, setStepGoal] = useState('10000');
  const router = useRouter();

  const handleNext = async () => {
    try {
      const formattedStepGoal = stepGoal.trim() || '10000'; // Default to 10000 if empty
      await AsyncStorage.setItem('stepGoal', formattedStepGoal);
      
      console.log('Step goal saved:', formattedStepGoal); // Debugging

      router.push('/onboarding/donation-amount');
    } catch (error) {
      console.error('Error saving step goal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Daily Step Goal</Text>
      <Text style={styles.subtitle}>How many steps do you want to walk each day?</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={stepGoal}
          onChangeText={(text) => setStepGoal(text.replace(/[^0-9]/g, ''))} // Only allow numbers
          keyboardType="number-pad"
          placeholder="10000"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
      textAlign: 'center',
    },
    inputContainer: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
    },
    input: {
      fontSize: 18,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#f4511e',
      padding: 15,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
