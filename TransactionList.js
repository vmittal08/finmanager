import React from "react";
import { Table } from "react-bootstrap";

const TransactionList = ({ transactions }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Amount</th>
          <th>Description</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>${transaction.amount}</td>
              <td>{transaction.description}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center">No transactions found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TransactionList;
