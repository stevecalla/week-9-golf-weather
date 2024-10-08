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
    const fs = require('fs');
    const cities = fs.readFileSync('searchHistory.json', 'utf-8');
    return JSON.parse(cities);
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    const fs = require('fs');
    fs.writeFileSync('searchHistory.json', JSON.stringify(cities));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.read();
    const newCity = new City(city, cities.length + 1);
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();
    const newCities = cities.filter((city: City) => city.id !== parseInt(id));
    await this.write(newCities);
  }
}

export default new HistoryService();
