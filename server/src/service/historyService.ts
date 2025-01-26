import { promises as fs } from 'fs';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: number;

  constructor(public nameIns: string, public idIns: number) {
    this.name = nameIns;
    this.id = idIns;
  }
};

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/db.json', 'utf-8');
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
   return await fs.writeFile('db/db.json', JSON.stringify(cities));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      // If cities isn't an array or can't be turned into one, send back a new empty array
      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.getCities();
    const newCity = new City(city, cities.length + 1);
    cities.push(newCity);
    await this.write(cities);
    return cities;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.getCities();
    const newCities = cities.filter((city: City) => city.id !== parseInt(id));
    await this.write(newCities);
    return newCities;
  }
}

export default new HistoryService();
