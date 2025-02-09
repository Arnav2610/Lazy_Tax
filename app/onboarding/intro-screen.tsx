import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";

export default function IntroScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/onboarding/step-goal');
  };

  return (
    <ImageBackground source={require('./background_image.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.textWrapper}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to LazyTax</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subtitle}>Hit your daily walking goal or give to charity.</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between', // Keeps button at bottom
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-end', // Right-aligns text
    paddingHorizontal: 30,
    paddingTop: 80, // Moves text higher
  },
  textWrapper: {
    width: '100%',
    alignItems: 'flex-end',
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Highlighted text block
    paddingRight: 6,
    paddingLeft: 6,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 0,
    marginBottom: 15,
    marginTop: 15,
    maxWidth: '80%', // Limits width of text box
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#f4511e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginBottom: 50, // Keeps button slightly above the bottom
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
