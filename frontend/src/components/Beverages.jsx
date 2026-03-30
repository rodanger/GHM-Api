import React, { useState, useEffect } from "react";
import api from "../api/api";
import BeverageForm from "../BeverageList";

const Beverages = () => {
  const [beverages, setBeverages] = useState([]);

  const loadBeverages = async () => {
    try {
      const res = await api.get("beverages/");
      setBeverages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addBeverage = async (data) => {
    try {
      await api.post("beverages/", data);
      loadBeverages();
    } catch (err) {
      console.error(err);
    }
  };

  const updateBeverage = async (id, data) => {
    try {
      await api.put(`beverages/${id}/`, data);
      loadBeverages();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBeverage = async (id) => {
    try {
      await api.delete(`beverages/${id}/`);
      loadBeverages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBeverages();
  }, []);

  return (
    <div>
      <h2>Beverages</h2>
      <BeverageForm addBeverage={addBeverage} />
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Brand</th><th>Quantity</th><th>Unit</th><th>Category</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {beverages.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.name}</td>
              <td>{b.brand}</td>
              <td>{b.quantity}</td>
              <td>{b.unit}</td>
              <td>{b.category}</td>
              <td>
                <button onClick={() => deleteBeverage(b.id)}>Delete</button>
                <button onClick={() => updateBeverage(b.id, {...b, quantity: b.quantity + 1})}>+1</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Beverages;
