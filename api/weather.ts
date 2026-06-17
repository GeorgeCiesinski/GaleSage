/**
 * Handles Visual Crossing API call for weather data.
 */

const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

type WeatherRequest = {
    query: {
        city?: string;
    };
};

type WeatherResponse = {
    status: (code: number) => WeatherResponse;
    json: (body: unknown) => WeatherResponse;
}

export default async function handler(
    req: WeatherRequest, 
    res: WeatherResponse
) {
    const city = req.query.city; 

    if (!city) {
        return res.status(400).json({ 
            error: 'City is required' 
        });
    }

    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
        return res.status(500).json ({ 
            error: 'API key not configured' 
        });
    }

    const encodedCity = encodeURIComponent(city);

    const url = `${BASE_URL}/${encodedCity}?unitGroup=us&key=${apiKey}&contentType=json`;

    const response = await fetch(url);

    if (!response.ok) {
        return res.status(response.status).json({ 
            error: 'Weather request failed' 
        })
    }

    const data = await response.json();

    return res.status(200).json(data);
}
