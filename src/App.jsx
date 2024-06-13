import React, { useEffect, useState } from "react";
import "./App.css";
import Component from "./Card/Cards.jsx";
import axios from "axios";

function App() {
  const [cards, setCards] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [transactions, setTransactions] = useState([]);

  const getTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:2222/api/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const addCard = () => {
    const formattedPrice = `$${parseFloat(price).toFixed(2)}`;
    const newCard = {
      name: name,
      description: description,
      price: formattedPrice,
      date: date,
    };
    setCards([...cards, newCard]);

    const url = "http://localhost:2222/api/transaction";

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price: parseFloat(price), date }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(json => {
        setTransactions([...transactions, json]);
        console.log('Transaction successfully added:', json);
      }) 
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const deleteTransaction = (id) => {
    const url = `http://localhost:2222/api/${id}`;

    fetch(url, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(json => {
        setTransactions(transactions.filter(transaction => transaction._id !== id));
        console.log('Transaction successfully deleted:', json);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  let balance = 0;
  for (const trans of transactions) {
    balance += parseFloat(trans.price);
  }

  return (
    <>
      <h1>${balance.toFixed(2)}</h1>

      <form>
        <div className="basic">
          <input
            type="text"
            placeholder="Item-Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="description">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </form>
      <button type="button" onClick={addCard}>Add Card</button>

      <div className="cards-container">
        {transactions.map((transaction, index) => (
          <div key={index} className="card">
            <Component
              name={transaction.name}
              description={transaction.description}
              price={transaction.price}
              date={transaction.date}
            />
            <button onClick={() => deleteTransaction(transaction._id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
