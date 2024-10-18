import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [values, setValues] = useState([]);
    const [place, setPlace] = useState('Karachi');  // The user-input place
    const [thisLocation, setLocation] = useState('');  // The location from the API response
    const [loading, setLoading] = useState(false);  // Loading state to indicate fetching data
    const [error, setError] = useState(null);  // Error state to handle API errors

    // Fetch weather data from API
    const fetchWeather = async () => {
        setLoading(true);
        setError(null);  // Reset error state
        const options = {
            method: 'GET',
            url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
            params: {
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            },
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com',
            }
        };

        try {
            const response = await axios.request(options);
            if (response.status === 200) {
                const thisData = Object.values(response.data.locations)[0];
                setLocation(thisData.address);  // Set the address from API
                setValues(thisData.values);  // Set the array of weather values
                setWeather(thisData.values[0]);  // Set the current weather
            } else {
                throw new Error('Failed to fetch weather data.');
            }
        } catch (e) {
            console.error(e);
            setError('This place does not exist or API request failed.');  // Set error message
        } finally {
            setLoading(false);  // Stop loading state after fetch
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [place]);

    useEffect(() => {
        console.log(values);
    }, [values]);

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place,
            loading,
            error
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
