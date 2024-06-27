import React from 'react';
import { nanoid } from 'nanoid';
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';
import styles from './CountryItem.module.css';

const CountryList = ({ cities, isLoading }) => {
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
