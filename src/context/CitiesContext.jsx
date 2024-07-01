import { createContext, useContext, useEffect, useReducer } from 'react';

const BASE_URL = 'http://localhost:9000';

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };

    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };

    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error('Unknown action type');
  }
};

const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: 'loading' });
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();

        dispatch({ type: 'cities/loaded', payload: data });
      } catch (err) {
        console.error(err);
        dispatch({ type: 'rejected', payload: 'Can not fetch the data' });
      }
    };
    fetchCities();
  }, []);

  const getCity = async (id) => {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: 'loading' });
    try {
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await response.json();

      dispatch({ type: 'city/loaded', payload: data });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'rejected', payload: 'Can not fetch the city data' });
    }
  };

  const createCity = async (newCity) => {
    dispatch({ type: 'loading' });
    try {
      const response = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });
      const data = await response.json();

      dispatch({ type: 'city/created', payload: data });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'rejected', payload: 'Can not create city' });
    }
  };

  const deleteCity = async (id) => {
    dispatch({ type: 'loading' });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: id });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'rejected', payload: 'Can not delete city' });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        error,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error('Context was outside the Provider');

  return context;
};

export { CitiesProvider, useCities };
