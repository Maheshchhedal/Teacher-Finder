import axios from "axios";

const LOCATIONIQ_URL = "https://us1.locationiq.com/v1/search.php";
const API_KEY = "pk.9106cdd9d7ea5f8ae018e2b56d43b48b"; // Your LocationIQ API key

// Create a reusable axios instance with default config
const locationIQAxios = axios.create({
  baseURL: LOCATIONIQ_URL,
  params: {
    key: API_KEY,
    format: "json",
    limit: 4,
    countrycodes: "np", // Restrict search to Nepal
  },
});

export const searchLocation = async (query) => {
  try {
    const response = await locationIQAxios.get("", {
      params: { q: query },
    });

    return response.data.map((result) => ({
      place_id: result.place_id,
      display_name: result.display_name,
      lat: result.lat,
      lon: result.lon,
    }));
  } catch (error) {
    console.error("Error fetching location data:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        } else {
          throw new Error(`LocationIQ API error: ${error.response.data.error || 'Unknown error'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error("No response received from LocationIQ API. Please check your internet connection.");
      }
    }
    
    // For non-Axios errors or unhandled cases
    throw new Error("An unexpected error occurred while fetching location data.");
  }
};