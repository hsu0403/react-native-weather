import * as Location from "expo-location";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "3af1f22d8f6c50619957a766b9f170fb";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Thunderstorm: "lightnings",
  Drizzle: "rain",
  Rain: "rains",
  Snow: "snowflake-8",
  Fog: "fog",
  Dust: "wind",
  Haze: "day-haze",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    if (!ok) {
      return;
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const json = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
      )
    ).json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          contentContainerStyle={styles.weather}
        >
          {days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator
                color="white"
                style={{ marginTop: 10 }}
                size="large"
              />
            </View>
          ) : (
            days.map((day, index) => (
              <View key={index} style={styles.day}>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={70}
                  color="#F0FFF0"
                />
                <View
                  style={{
                    width: "100%",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      width: "60%",
                      marginTop: 50,
                    }}
                  >
                    <Text style={styles.temp}>
                      {parseFloat(day.temp.day).toFixed(1)}&deg;C
                    </Text>
                    <Text style={styles.description}>
                      {day.weather[0].main}
                    </Text>
                    <Text style={styles.detail}>
                      {day.weather[0].description}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: "flex-end",
                    width: "80%",
                    marginTop: 100,
                  }}
                >
                  <Text style={styles.other}>pressure: {day.pressure}</Text>
                  <Text style={styles.other}>humidity: {day.humidity}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.other}>
                      wind_speed: {day.wind_speed} |{" "}
                    </Text>
                    <Text style={styles.other}>wind_deg: {day.wind_deg}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9370DB",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "#4B0082",
    fontSize: 48,
    fontWeight: "bold",
  },
  weather: {},
  day: {
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  temp: {
    color: "#FF4500",
    fontSize: 32,
  },
  description: {
    color: "#F0FFF0",
    fontSize: 60,
  },
  detail: {
    color: "#F0FFF0",
    fontSize: 20,
    marginTop: -10,
  },
  other: {
    color: "#F0FFF0",
    fontSize: 14,
  },
});
