enum Weather {
  UNKNOWN = "Unknown",
  SUNNY = "Sunny",
  RAINY = "Rainy",
  SNOWY = "Snowy",
  FOGGY = "Foggy",
}

export type WeatherReport = {
  [key in keyof typeof Weather]?: number;
};

// TODO: merge common utils and types from all apps into a new workspace package
