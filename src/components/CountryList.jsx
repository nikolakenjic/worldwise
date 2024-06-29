import { nanoid } from 'nanoid';
import { useCities } from '../context/CitiesContext';
import styles from './CountryItem.module.css';
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';

const CountryList = () => {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />;

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      return arr;
    }
  }, []);

  const countryList = countries.map((country) => (
    <CountryItem key={nanoid()} country={country} />
  ));

  return <ul className={styles.countryList}>{countryList}</ul>;
};

export default CountryList;
