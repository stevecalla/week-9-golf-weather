import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  // TODO: GET weather data from city name
  const weatherService = new WeatherService();
  const historyService = new HistoryService();
  const city = req.body.city;
  weatherService
    .getWeatherForCity(city)
    .then((data: string) => {
      res.json(data);
    })
    .catch((err: string) => {
      res.status(500).json(err);
    });
  // TODO: save city to search history
  historyService.addCity(city);
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  console.log(req);
  const historyService = new HistoryService();
  const history = await historyService.getCities();
  res.json(history);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const historyService = new HistoryService();
  const id = req.params.id;
  await historyService.removeCity(id);
  res.status(200).send();
});

export default router;
