import styles from './CityList.module.css';
import { useCities } from '../context/CitiesContext';
import Spinner from './Spinner';
import CityItem from './CityItem';
import Message from './Message';

const CityList = () => {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />;

  const cityList = cities.map((city) => <CityItem key={city.id} city={city} />);

  return <ul className={styles.cityList}>{cityList}</ul>;
};

export default CityList;
