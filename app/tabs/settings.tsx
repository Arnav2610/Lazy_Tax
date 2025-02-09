import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const [stepGoal, setStepGoal] = useState('');
  const [donationAmount, setDonationAmount] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedStepGoal = await AsyncStorage.getItem('stepGoal');
      const savedDonationAmount = await AsyncStorage.getItem('donationAmount');
      
      if (savedStepGoal) setStepGoal(savedStepGoal);
      if (savedDonationAmount) setDonationAmount(savedDonationAmount);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('stepGoal', stepGoal);
      await AsyncStorage.setItem('donationAmount', donationAmount);
      alert('Settings saved successfully! Refresh app to view changes.');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Daily Step Goal</Text>
        <TextInput
          style={styles.input}
          value={stepGoal}
          onChangeText={setStepGoal}
          keyboardType="number-pad"
          placeholder="10000"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Donation Amount ($)</Text>
        <TextInput
          style={styles.input}
          value={donationAmount}
          onChangeText={setDonationAmount}
          keyboardType="decimal-pad"
          placeholder="5"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#f4511e',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});