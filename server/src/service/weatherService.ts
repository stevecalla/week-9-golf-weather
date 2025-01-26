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
  iconDescription: string;
  tempF: number;
  icon: string;
  humidity: number;
  windSpeed: number;

  constructor(
    city: string,
    date: string,
    iconDescription: string,
    tempF: number,
    icon: string,
    humidity: number,
    windSpeed: number
  ) {
    this.city = city;
    this.date = date;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.icon = icon;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
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
    this.apiKey = String(process.env.API_KEY);
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response: Coordinates[] = await fetch(query).then((res) =>
      res.json()
    );
    return response[0];
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {

    if (!locationData) {
      throw new Error('City not found');
    }

    const { lat, lon } = locationData;
    console.log("lat: ", lat);
    console.log("lon: ", lon);
    const coordinates: Coordinates = { lat, lon };
    return coordinates;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${this.apiKey}`;

  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates | null> {
    try {
      const query = this.buildGeocodeQuery();
      const locationData =  await this.fetchLocationData(query);
      const data = this.destructureLocationData(locationData);
      return data;
      
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    console.log("query: ", query);
    const response = await fetch(query);
    const jResponse = await response.json();
    console.log("here");
    const currentWeather = this.parseCurrentWeather(jResponse.list[0]);
    
    const forecast: Weather[] = this.buildForecastArray(currentWeather, jResponse.list);
    return forecast;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const date = new Date(response.dt_txt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    console.log("temptest: ", response.main.temp);

    const currentWeather = new Weather(
      this.cityName,
      date,
      response.weather[0].description,
      response.main.temp,
      response.weather[0].icon,
      response.main.humidity,
      response.wind.speed
    );
    console.log("finished parsing");

    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast: Weather[] = [];
    forecast.push(currentWeather);
    let currentDate = new Date(weatherData[0].dt_txt).getDate();
    let dayCount = 0;
    console.log("checking date");
    console.log("forecast length: ", forecast.length);

    for (let i = 1; i < weatherData.length; i++) {
      console.log("currentDate: ", currentDate);
      console.log("dayCount: ", dayCount);
      console.log("newDate: ", new Date(weatherData[i].dt_txt).getDate());
      const newDate = new Date(weatherData[i].dt_txt).getDate();
      if (newDate > currentDate) {
        const weather = weatherData[i];
        const forecastWeather = new Weather(
          this.cityName,
          weather.dt_txt= new Date(weather.dt_txt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          weather.weather[0].description,
          weather.main.temp,
          weather.weather[0].icon,
          weather.main.humidity,
          weather.wind.speed
        );
        forecast.push(forecastWeather);
        currentDate = newDate;
        dayCount++;
        if (dayCount >= 5) {
          break;
        }
      }
    }
    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    console.log("city: ", this.cityName);
    const coordinates = await this.fetchAndDestructureLocationData();
    console.log("coordinates: ", coordinates);
    if (coordinates) {
      const currentWeather = await this.fetchWeatherData(coordinates);
      return currentWeather;
    }
    return null;
  }
}

export default new WeatherService();
