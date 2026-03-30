import React, { useEffect, useState } from "react";
import { getBeverages, createBeverage, updateBeverage, deleteBeverage } from "../api.jsx";

const token = "155d8498d56573c1f476520c1f6063d0dfc30a1a";

export default function BeverageList() {
  const [beverages, setBeverages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", brand: "", quantity: 0, unit: "", category: "" });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBeverages(token);
      setBeverages(data);
    };
    fetchData();
  }, []);

  // Agregar nueva bebida
  const addBeverage = async () => {
    const created = await createBeverage(token, formData);
    if (!created) return alert("Error creando bebida");
    setBeverages([...beverages, created]); // <- API devuelve el objeto directamente
    setFormData({ name: "", brand: "", quantity: 0, unit: "", category: "" });
  };

  // Guardar edición
  const saveEdit = async () => {
    const updated = await updateBeverage(token, editing, formData);
    if (!updated) return alert("Error actualizando bebida");
    setBeverages(beverages.map(b => (b.id === editing ? updated : b)));
    setEditing(null);
    setFormData({ name: "", brand: "", quantity: 0, unit: "", category: "" });
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditing(null);
    setFormData({ name: "", brand: "", quantity: 0, unit: "", category: "" });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Beverages Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {beverages.map(b => (
          <div key={b.id} className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
            {editing === b.id ? (
              <div className="space-y-2">
                <input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="p-2 rounded bg-gray-700 text-white w-full"
                  placeholder="Name"
                />
                <input
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  className="p-2 rounded bg-gray-700 text-white w-full"
                  placeholder="Brand"
                />
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="p-2 rounded bg-gray-700 text-white w-full"
                  placeholder="Quantity"
                />
                <input
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  className="p-2 rounded bg-gray-700 text-white w-full"
                  placeholder="Unit"
                />
                <input
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="p-2 rounded bg-gray-700 text-white w-full"
                  placeholder="Category"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 px-3 py-1 rounded hover:bg-green-400"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold">{b.name}</h2>
                <p>Brand: {b.brand}</p>
                <p>Quantity: {b.quantity} {b.unit}</p>
                <p>Category: {b.category}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    className="bg-indigo-500 px-2 py-1 rounded hover:bg-indigo-400"
                    onClick={() => {
                      setEditing(b.id);
                      setFormData({ ...b });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 px-2 py-1 rounded hover:bg-red-400"
                    onClick={async () => {
                      const ok = await deleteBeverage(token, b.id);
                      if (ok) setBeverages(beverages.filter(x => x.id !== b.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulario agregar bebida */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Add Beverage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            placeholder="Brand"
            value={formData.brand}
            onChange={e => setFormData({ ...formData, brand: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            placeholder="Unit"
            value={formData.unit}
            onChange={e => setFormData({ ...formData, unit: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            placeholder="Category"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button
          onClick={addBeverage}
          className="mt-4 bg-green-500 px-4 py-2 rounded hover:bg-green-400"
        >
          Add Beverage
        </button>
      </div>
    </div>
  );
}

