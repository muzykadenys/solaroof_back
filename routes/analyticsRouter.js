const express = require("express");
const axios = require("axios");
const router = express.Router();
const SunCalc = require("suncalc");
const ObserveSchema = require("../schemas/observeSchema");

const lat = 49.655441;
const lon = 23.496289;
const wattageConst = 660;
const efficiencyPercentsConst = 21.2;
const temperatureCoefPowerConst = -0.34;

const getWeatherForecast = async () => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,diffuse_radiation,direct_normal_irradiance`;
  const responce = await axios.get(url);

  return responce.data;
};

const getNameDaysOfWeek = (date) => {
  const currentDate = new Date(date);

  return currentDate.toLocaleDateString("en-US", { weekday: "long" });
};

const groupDaysForecast = (hourList) => {
  const res = [];

  for (let i = 0; i < hourList.time.length; i++) {
    res.push({
      day: getNameDaysOfWeek(hourList.time[i]),
      date: hourList.time[i],
      temperature: hourList.temperature_2m[i],
      DHI: hourList.diffuse_radiation[i],
      DNI: hourList.direct_normal_irradiance[i],
    });
  }

  return res;
};

const getZenithAngle = (latitude, longitude, time) => {
  const date = new Date(time); // Current date and time

  // Calculate solar position
  const solarPosition = SunCalc.getPosition(date, latitude, longitude);

  // Extract solar zenith angle from the calculated solar position
  return 90 - solarPosition.altitude * (180 / Math.PI);
};

const getSolarAzimuthAngle = (latitude, longitude, time) => {
  const date = new Date(time); // Current date and time

  // Calculate solar position
  const solarPosition = SunCalc.getPosition(date, latitude, longitude);

  // Calculate solar azimuth angle from the calculated solar position
  return (180 + solarPosition.azimuth * (180 / Math.PI)) % 360;
};

const getAreaOfPanel = (wattage, efficiencyPercents) => {
  return wattage / (1000 * efficiencyPercents * 0.01);
};

const calculatePowerByHour = (
  lat,
  lon,
  wattage,
  efficiencyPercents,
  temperatureCoefPower,
  hour
) => {
  const DNI = hour.DNI; // Direct normal irradiance perpendicular to the sun (W/m^2)
  const DHI = hour.DHI; // Diffuse horizontal irradiance on a horizontal surface (W/m^2)
  const beta = 45; // Tilt angle of the surface (degrees)
  const gamma = 180; // Azimuth angle of the surface (degrees)
  const z = getZenithAngle(lat, lon, hour.date); // Solar zenith angle (degrees)
  const phi = getSolarAzimuthAngle(lat, lon, hour.date); // Solar azimuth angle (degrees)
  const rho = 0.2; // Ground reflectance or albedo (dimensionless)
  const area = getAreaOfPanel(wattage, efficiencyPercents);

  // Convert degrees to radians
  const betaRad = (beta * Math.PI) / 180;
  const gammaRad = (gamma * Math.PI) / 180;
  const zRad = (z * Math.PI) / 180;
  const phiRad = (phi * Math.PI) / 180;

  // Calculate the angle of incidence using the formula
  const theta = Math.acos(
    Math.cos(zRad) * Math.cos(betaRad) +
      Math.sin(zRad) * Math.sin(betaRad) * Math.cos(phiRad - gammaRad)
  );

  // Calculate solar irradiance on the tilted surface using the formula
  const S_module =
    DNI * Math.cos(theta) +
    (DHI * (1 + Math.cos(betaRad))) / 2 +
    (DNI * rho * (1 - Math.cos(betaRad))) / 2;

  const power = area * S_module * efficiencyPercents * 0.01;

  const powerTemperatureCoef =
    power + power * temperatureCoefPower * 0.01 * (hour.temperature - 25);

  //   console.log(S_module, "W/m^2");
  //   console.log(powerTemperatureCoef, "W");
  //   console.log(hour);

  return powerTemperatureCoef;
};

const writeObserveToDB = async () => {
  const weatherForecast = await getWeatherForecast();
  const groupDaysForecastList = groupDaysForecast(weatherForecast.hourly);

  const result = [];

  groupDaysForecastList.forEach((el, index) => {
    result.push({
      date: el.date,
      DNI: el.DNI,
      DHI: el.DHI,
      temperature: el.temperature,
      power: calculatePowerByHour(
        lat,
        lon,
        wattageConst,
        efficiencyPercentsConst,
        temperatureCoefPowerConst,
        el
      ),
      volt: 0,
      amp: 0,
    });
  });

  const newObserve = new ObserveSchema({ data: result });
  await newObserve.save();
};

router.get("/", async (req, res) => {
  try {
    // const weatherForecast = await getWeatherForecast();
    // const groupDaysForecastList = groupDaysForecast(weatherForecast.hourly);
    // console.log(getSolarAzimuthAngle(lat, lon, "2023-08-15T14:19"));

    // const resultPower = calculatePowerByHour(
    //   lat,
    //   lon,
    //   660,
    //   21.2,
    //   -0.34,
    //   groupDaysForecastList[37]
    // );

    writeObserveToDB();

    // res.status(201).json(groupDaysForecastList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
