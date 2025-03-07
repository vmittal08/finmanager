import axios from "axios";
import { toast } from "react-toastify";

// API Base URL
const API_URL = "http://localhost:5000/api/transactions";

// Fetch Transactions
export const fetchTransactions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { transactions: [] };
  }
};

// Add Transaction
export const addTransaction = async (transaction) => {
  try {
    const response = await axios.post(API_URL, transaction);
    return response.data;
  } catch (error) {
    console.error("Failed to add transaction:", error);
    toast.error("Failed to add transaction.");
    return { success: false };
  }
};

// Delete Transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    toast.success("Transaction deleted successfully!");
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    toast.error("Error deleting transaction.");
    return { success: false };
  }
};

// Update Transaction
export const updateTransaction = async (transaction) => {
  try {
    const response = await axios.put(`${API_URL}/${transaction.id}`, transaction);
    toast.success("Transaction updated successfully!");
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    toast.error("Error updating transaction.");
    return { success: false };
  }
};

// Create Transaction (Alias for Add Transaction)
export const createTransaction = async (transactionData) => {
  return await addTransaction(transactionData);
};
