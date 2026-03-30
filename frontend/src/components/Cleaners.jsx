import React, { useState, useEffect } from "react";
import api from "../api/api";

const Cleaners = () => {
  const [cleaners, setCleaners] = useState([]);

  const loadCleaners = async () => {
    try {
      const res = await api.get("cleaners/");
      setCleaners(res.data);
    } catch (err) {
      console.error("Error loading cleaners:", err);
    }
  };

  const addCleaner = async (data) => {
    try {
      await api.post("cleaners/", data);
      loadCleaners();
    } catch (err) {
      console.error("Error adding cleaner:", err);
    }
  };

  const updateCleaner = async (id, data) => {
    try {
      await api.put(`cleaners/${id}/`, data);
      loadCleaners();
    } catch (err) {
      console.error("Error updating cleaner:", err);
    }
  };

  const deleteCleaner = async (id) => {
    try {
      await api.delete(`cleaners/${id}/`);
      loadCleaners();
    } catch (err) {
      console.error("Error deleting cleaner:", err);
    }
  };

  useEffect(() => {
    loadCleaners();
  }, []);

  return (
    <div>
      <h2>Cleaners</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {cleaners.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.brand}</td>
              <td>{c.quantity}</td>
              <td>{c.unit}</td>
              <td>{c.category}</td>
              <td>
                <button onClick={() => deleteCleaner(c.id)}>Delete</button>
                <button
                  onClick={() =>
                    updateCleaner(c.id, { ...c, quantity: c.quantity + 1 })
                  }
                >
                  +1
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cleaners;
