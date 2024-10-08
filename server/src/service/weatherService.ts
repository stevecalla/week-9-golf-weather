import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  description: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;

  constructor(
    city: string,
    date: string,
    description: string,
    temp: number,
    feelsLike: number,
    humidity: number,
    wind: number
  ) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.wind = wind;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org'
    this.apiKey = String(process.env.WEATHER_API_KEY);
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;

  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { city, observation_time, weather, temp, feels_like, humidity, wind_speed } = response.data;
    return new Weather(city, observation_time, weather, temp, feels_like, humidity, wind_speed);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast = weatherData.map((day: any) => {
      const { valid_date, weather, temp, app_max_temp, rh, wind_spd } = day;
      return new Weather(currentWeather.city, valid_date, weather, temp, app_max_temp, rh, wind_spd);
    });
    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const currentWeatherResponse = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(currentWeatherResponse);
    const forecastResponse = await this.fetchWeatherData(coordinates);
    const forecast = this.buildForecastArray(currentWeather, forecastResponse.data);
    return { currentWeather, forecast };
  }
}

export default new WeatherService();
