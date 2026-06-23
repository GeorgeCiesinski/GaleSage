/**
 * Vercel serverless handler that proxies weather requests to Visual Crossing.
 *
 * Validates input, attaches the API key server-side, and returns weather JSON.
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

/**
 * Handles incoming weather API requests from the frontend.
 *
 * @param req - The incoming request containing the city query parameter.
 * @param res - The response object used to send status codes and JSON.
 * @returns A JSON response with weather data or an error message.
 */
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
      error: `Upstream weather request failed (${response.status})`
    });
  }

  const data = await response.json();

  return res.status(200).json(data);
}
