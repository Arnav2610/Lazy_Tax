import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DonationAmount() {
  const [donationAmount, setDonationAmount] = useState('5');
  const router = useRouter();

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('donationAmount', donationAmount);
      router.push('/tabs');
    } catch (error) {
      console.error('Error saving donation amount:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Donation Amount</Text>
      <Text style={styles.subtitle}>How much will you donate if you don't reach your goal?</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={donationAmount}
          onChangeText={setDonationAmount}
          keyboardType="decimal-pad"
          placeholder="5"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Finish</Text>
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
  