import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Donations() {
  const [totalDonation, setTotalDonation] = useState(10);

  // Load the total donation amount from AsyncStorage
  useEffect(() => {
    const loadTotalDonation = async () => {
      try {
        const savedDonation = await AsyncStorage.getItem("totalDonation");
        if (savedDonation) {
          setTotalDonation(parseFloat(savedDonation));
        }
      } catch (error) {
        console.error("Error loading total donation:", error);
      }
    };

    loadTotalDonation();
  }, []);

  // Function to handle the donation link
  const handleDonate = (charityLink: string) => {
    const donationLink = `${charityLink}?amount=${totalDonation}&frequency=ONCE#/donate/card/confirm`;
    Linking.openURL(donationLink);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Donations Owed</Text>
      <Text style={styles.amount}>${totalDonation.toFixed(2)}</Text>

      <Text style={styles.subtitle}>Choose a Charity to Donate To:</Text>

      <View style={styles.charityContainer}>
        {/* Red Cross Donation Box */}
        <TouchableOpacity
          style={styles.charityBox}
          onPress={() => handleDonate("https://www.every.org/redcross")}
        >
          <Image
            source={require("./redcross.jpg")} // Ensure the image is in the same directory
            style={styles.charityLogo}
          />
        </TouchableOpacity>

        {/* Wikimedia Foundation Donation Box */}
        <TouchableOpacity
          style={styles.charityBox}
          onPress={() => handleDonate("https://www.every.org/wikimediafoundation")}
        >
          <Image
            source={require("./wikimedia.png")} // Ensure the image is in the same directory
            style={styles.charityLogo}
          />
        </TouchableOpacity>

        {/* WWF Donation Box */}
        <TouchableOpacity
          style={styles.charityBox}
          onPress={() => handleDonate("https://www.every.org/wwf")}
        >
          <Image
            source={require("./wwf.png")} // Ensure the image is in the same directory
            style={styles.charityLogo}
          />
        </TouchableOpacity>

        {/* WWF Donation Box */}
        <TouchableOpacity
          style={styles.charityBox}
        >
          <Text style={styles.charityName}>More coming soon!</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  amount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#f4511e",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  charityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  charityBox: {
    width: "48%", // Slightly less than half to account for spacing
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  charityLogo: {
    width: "100%", // Stretch to fill the width of the box
    height: 120, // Keep the height fixed
    resizeMode: "contain", // Ensure the logo scales proportionally
  },
  charityName: {
    fontSize: 16, // Smaller font size
    fontWeight: "600", // Less bold
    color: "#333",
    textAlign: "center", // Center the text
  },
});