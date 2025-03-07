import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionList from "../components/TransactionList"; // Import TransactionList

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions/all");
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add a new transaction
  const addTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/transactions/add", { amount, description });
      setAmount("");
      setDescription("");
      fetchTransactions(); // Refresh transaction list
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Transactions</h2>

      <form onSubmit={addTransaction}>
        <div className="mb-3">
          <input type="number" className="form-control" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Add Transaction</button>
      </form>

      {/* Use TransactionList component */}
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default Transactions;
