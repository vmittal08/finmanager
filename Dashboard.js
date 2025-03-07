import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Form, Modal, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import { FaList, FaChartPie, FaEdit, FaTrash } from "react-icons/fa";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../api/requests";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AppNavbar from "../../components/Navbar";
import "react-toastify/dist/ReactToastify.css";

// Redirect user if not authenticated
const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    amount: "",
    type: "income",
    category: "",
    date: new Date(),
  });
  const [editTransaction, setEditTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list");

  const categories = {
    income: [
      "Salary",
      "Freelance",
      "Investment",
      "Business",
      "Royalty",
      "Commission",
      "Interest",
    ],
    expense: [
      "Food",
      "Transport",
      "Rent",
      "Utilities",
      "Shopping",
      "Groceries",
      "Insurance",
      "Pets",
      "Health",
      "Transportation",
      "Entertainment",
    ],
  };

  // Fetch transactions
  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTransactions();
      setTransactions(data.transactions);
    } catch (error) {
      toast.error("Failed to load transactions.");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleShow = (transaction = null) => {
    setEditTransaction(transaction);
    setFormValues(
      transaction || {
        title: "",
        amount: "",
        type: "income",
        category: "",
        date: new Date(),
      }
    );
    setModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editTransaction) {
        response = await updateTransaction({
          ...formValues,
          id: editTransaction._id,
        });
        toast.success("Transaction updated successfully!");
      } else {
        response = await addTransaction(formValues);
        toast.success("Transaction added successfully!");
      }

      if (response.success) {
        setModalVisible(false);
        setEditTransaction(null);
        setFormValues({
          title: "",
          amount: "",
          type: "income",
          category: "",
          date: new Date(),
        });

        loadTransactions();
      }
    } catch (error) {
      toast.error("Error saving transaction.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully!");
      loadTransactions();
    } catch (error) {
      toast.error("Error deleting transaction.");
    }
  };

  return (
    <>
      <AppNavbar />
      <Container
        className="dashboard-container"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${process.env.PUBLIC_URL}/images/bg1.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          padding: "20px",
        }}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="dashboard-content">
            <div className="dashboard-header d-flex justify-content-between">
              <div>
                <Button variant="light" onClick={() => setViewMode("list")}>
                  <FaList />
                </Button>
                <Button variant="light" onClick={() => setViewMode("chart")}>
                  <FaChartPie />
                </Button>
              </div>
              <Button onClick={() => setModalVisible(true)}>
                Add Transaction
              </Button>
            </div>

            {/* Transactions List */}
            {viewMode === "list" && (
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{transaction.title}</td>
                      <td>${transaction.amount}</td>
                      <td>{transaction.type}</td>
                      <td>{transaction.category}</td>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleShow(transaction)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(transaction._id)}
                          className="ms-2"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            {/* Pie Chart View */}
            {viewMode === "chart" && (
              <ResponsiveContainer width="100%" height={300} className="mt-3">
                <PieChart>
                  <Pie
                    data={transactions.map((t) => ({
                      name: t.category,
                      value: parseFloat(t.amount),
                    }))}
                    cx="50%"
                    cy="50%"
                    label
                    outerRadius={120}
                    fill="#8884d8"
                  >
                    {transactions.map((_, index) => (
                      <Cell
                        key={index}
                        fill={["#8884d8", "#82ca9d"][index % 2]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Modal for Adding/Editing Transactions */}
        <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editTransaction ? "Edit" : "Add"} Transaction
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={formValues.title}
                  onChange={(e) =>
                    setFormValues({ ...formValues, title: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={formValues.amount}
                  onChange={(e) =>
                    setFormValues({ ...formValues, amount: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={formValues.type}
                  onChange={(e) =>
                    setFormValues({ ...formValues, type: e.target.value })
                  }
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>

        <ToastContainer />
      </Container>
    </>
  );
};

export default Dashboard;
