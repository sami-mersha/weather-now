import './weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import { useEffect, useState } from 'react';

// Define the type for weather data
interface WeatherData {
    humidity: number;
    wind: number;
    temperature: number;
    location: string;
    description: string;
}

// Weather icon mapping
const weatherIcons: Record<string, string> = {
    "Clear": clear_icon,
    "Sunny": clear_icon,
    "Partly cloudy": cloud_icon,
    "Cloudy": cloud_icon,
    "Overcast": cloud_icon,
    "Mist": cloud_icon,
    "Patchy rain possible": drizzle_icon,
    "Patchy snow possible": snow_icon,
    "Patchy sleet possible": snow_icon,
    "Patchy freezing drizzle possible": drizzle_icon,
    "Thundery outbreaks possible": rain_icon,
    "Blowing snow": snow_icon,
    "Blizzard": snow_icon,
    "Fog": cloud_icon,
    "Freezing fog": cloud_icon,
    "Patchy light drizzle": drizzle_icon,
    "Light drizzle": drizzle_icon,
    "Heavy rain": rain_icon,
    "Light rain": drizzle_icon,
    "Moderate rain": rain_icon,
    "Heavy freezing rain": rain_icon,
    "Light snow": snow_icon,
    "Moderate snow": snow_icon,
    "Heavy snow": snow_icon,
    "Ice pellets": snow_icon,
};

const Weather = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [city, setCity] = useState<string>('Addis Ababa');
    const [loading, setLoading] = useState<boolean>(false);

    const search = async (city: string) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://api.weatherstack.com/current?access_key=${import.meta.env.VITE_WEATHER_API_KEY}&query=${city}`
            );
            const data = await response.json();

            if (data.success === false) {
                throw new Error(data.error.info || "Failed to fetch weather data.");
            }

            // Update state with fetched weather data
            setWeatherData({
                humidity: data.current.humidity,
                wind: data.current.wind_speed,
                temperature: Math.floor(data.current.temperature),
                location: data.location.name,
                description: data.current.weather_descriptions[0],
            });
        } catch (error) {
            console.error("Error fetching weather data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        search(city);
    }, []);

    return (
        <div className='weather'>
            <div className='search-bar'>
                <input
                    type="text"
                    placeholder='Search city...'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <img src={search_icon} alt="Search" onClick={() => search(city)} />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : weatherData ? (
                <>
                    <img
                        src={weatherIcons[weatherData.description] || clear_icon}
                        alt={weatherData.description}
                        className='weather-icon'
                    />
                    <p className='temperature'>{weatherData.temperature} °C</p>
                    <p className='location'>{weatherData.location}</p>
                    <p className='description'>{weatherData.description}</p>

                    <div className='weather-data'>
                        <div className='col'>
                            <img src={humidity_icon} alt="Humidity" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className='col'>
                            <img src={wind_icon} alt="Wind Speed" />
                            <div>
                                <p>{weatherData.wind} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>No weather data available.</p>
            )}
        </div>
    );
};

export default Weather;
