import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setCurrencies(Object.keys(response.data.rates));
      } catch (err) {
        setError('Не удалось загрузить данные о валютах.');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  const convertCurrency = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
      );
      const rate = response.data.rates[toCurrency];
      setConvertedAmount((amount * rate).toFixed(2));
    } catch (err) {
      setError('Произошла ошибка при конвертации валют.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <h2>Конвертер валют</h2>
      {error && <p className='error'>{error}</p>}
      <input
        className='input'
        type='number'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        className='select'
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
      <select className='select' value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
      <button className='button' onClick={convertCurrency}>
        Конвертировать
      </button>
      {loading && <p>Загрузка...</p>}
      {convertedAmount !== null && (
        <h3>
          Результат: {convertedAmount} {toCurrency}
        </h3>
      )}
    </div>
  );
};

export default App;
