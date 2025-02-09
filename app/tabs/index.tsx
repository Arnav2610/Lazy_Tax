import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from 'react-native-progress';
import { Pedometer } from 'expo-sensors';
import { BarChart } from "react-native-chart-kit";

interface DayData {
  date: string;
  steps: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

interface CustomChartConfig {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  decimalPlaces: number;
  color: (opacity?: number) => string;
  labelColor: (opacity?: number) => string;
  style?: {
    borderRadius?: number;
  };
  propsForDots?: {
    r: string;
    strokeWidth: string;
    stroke: string;
  };
}

interface DotContentProps {
  x: number;
  y: number;
  index: number;
}

interface CustomBarChartProps {
  data: ChartData;
  width: number;
  height: number;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  chartConfig: CustomChartConfig;
  style?: any;
  showBarTops?: boolean;
  fromZero?: boolean;
  withInnerLines?: boolean;
  withHorizontalLabels?: boolean;
  withVerticalLabels?: boolean;
  renderDotContent?: (props: DotContentProps) => React.ReactNode;
}

export default function Index() {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000);
  const [donationAmount, setDonationAmount] = useState(5);
  const [weekHistory, setWeekHistory] = useState<DayData[]>([]);

  useEffect(() => {
    loadSettings();
    setupPedometer();
    loadWeekHistory();
    checkEndOfDay();
  }, []);

  const loadSettings = async () => {
    try {
      const savedStepGoal = await AsyncStorage.getItem('stepGoal');
      const savedDonationAmount = await AsyncStorage.getItem('donationAmount');
      
      if (savedStepGoal) setStepGoal(parseInt(savedStepGoal));
      if (savedDonationAmount) setDonationAmount(parseFloat(savedDonationAmount));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadWeekHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('stepHistory');
      if (history) {
        setWeekHistory(JSON.parse(history));
      } else {
        const newHistory = await generatePastWeekData();
        setWeekHistory(newHistory);
        await AsyncStorage.setItem('stepHistory', JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Error loading step history:', error);
    }
  };

  const generatePastWeekData = async () => {
    const history: DayData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        history.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          steps: result ? result.steps : 0
        });
      } catch (error) {
        history.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          steps: 0
        });
      }
    }
    return history;
  };

  const updateTodaySteps = async (steps: number) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const updatedHistory = weekHistory.map(day => 
      day.date === today ? { ...day, steps } : day
    );
    setWeekHistory(updatedHistory);
    await AsyncStorage.setItem('stepHistory', JSON.stringify(updatedHistory));
  };

  const setupPedometer = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (!isAvailable) {
        console.log('Pedometer is not available');
        return;
      }

      const { status } = await Pedometer.requestPermissionsAsync();
      if (status === 'granted') {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        
        const result = await Pedometer.getStepCountAsync(start, end);
        if (result) {
          setCurrentSteps(result.steps);
          updateTodaySteps(result.steps);
        }

        const subscription = Pedometer.watchStepCount(result => {
          setCurrentSteps(prevSteps => {
            const newSteps = prevSteps + result.steps;
            updateTodaySteps(newSteps);
            return newSteps;
          });
        });

        return () => {
          subscription.remove();
        };
      }
    } catch (error) {
      console.error('Error setting up pedometer:', error);
    }
  };

  const checkEndOfDay = () => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    if (now >= endOfDay) {
      updateDonationAmount();
    }
  };

  const updateDonationAmount = async () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const todayData = weekHistory.find(day => day.date === today);

    if (todayData && todayData.steps < stepGoal) {
      try {
        const savedDonation = await AsyncStorage.getItem("totalDonation");
        const currentDonation = savedDonation ? parseFloat(savedDonation) : 0;
        const newDonation = currentDonation + donationAmount;

        await AsyncStorage.setItem("totalDonation", newDonation.toString());
      } catch (error) {
        console.error("Error updating donation amount:", error);
      }
    }
  };

  const progress = Math.min(currentSteps / stepGoal, 1);
  const screenWidth = Dimensions.get('window').width;

  const chartData: ChartData = {
    labels: weekHistory.map(day => day.date),
    datasets: [
      {
        data: weekHistory.map(day => day.steps),
      }
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressSection}>
        <Text style={styles.stepsText}>{currentSteps} / {stepGoal} steps</Text>
        <Progress.Circle
          size={200}
          progress={progress}
          thickness={15}
          color="#f4511e"
          unfilledColor="#eee"
          borderWidth={0}
          showsText
          formatText={() => `${Math.round(progress * 100)}%`}
        />
        {progress < 1 && (
          <Text style={styles.donationText}>
            ${donationAmount} will be donated if goal isn't met today
          </Text>
        )}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Last 7 Days</Text>
        {weekHistory.length > 0 && (
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(244, 81, 30, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#f4511e"
              }
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            showBarTops={false}
            fromZero={true}
            withInnerLines={true}
            withHorizontalLabels={true}
            withVerticalLabels={false}
            renderDotContent={({ x, y, index }: DotContentProps) => {
              const value = chartData.datasets[0].data[index];
              if (value >= stepGoal) {
                return (
                  <View key={index} style={{
                    position: 'absolute',
                    top: y - 15,
                    left: x - 10,
                  }}>
                    <Text style={{color: '#4CAF50', fontSize: 12}}>✓</Text>
                  </View>
                );
              }
              return null;
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepsText: {
    fontSize: 24,
    marginBottom: 20,
  },
  donationText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  chartContainer: {
    flex: 1,
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});