import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BeverageChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Cargando datos..."); // Mensaje de depuración
    axios
      .get("http://127.0.0.1:8000/api/beverages/")
      .then((response) => {
        console.log("Datos cargados:", response.data); // Mensaje de depuración
        const data = response.data;
        const labels = data.map((item) => item.BeverageName);
        const stockValues = data.map((item) => item.Stock);

        setChartData({
          labels,
          datasets: [
            {
              label: "Stock de Bebidas",
              data: stockValues,
              backgroundColor: stockValues.map((stock) =>
                stock < 10 ? "rgba(239, 68, 68, 0.7)" : "rgba(99, 102, 241, 0.7)"
              ),
              borderColor: stockValues.map((stock) =>
                stock < 10 ? "rgba(239, 68, 68, 1)" : "rgba(99, 102, 241, 1)"
              ),
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error); // Mensaje de depuración
        setError("Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.");
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Stock de Bebidas por Producto",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#1E3A8A", // Color azul oscuro
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#4B5563", // Color gris oscuro
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#1E3A8A", // Color azul oscuro
        titleColor: "#FFFFFF", // Color blanco
        bodyColor: "#FFFFFF", // Color blanco
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Bebidas",
          color: "#4B5563", // Color gris oscuro
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          color: "#4B5563", // Color gris oscuro
        },
      },
      y: {
        title: {
          display: true,
          text: "Stock",
          color: "#4B5563", // Color gris oscuro
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          color: "#4B5563", // Color gris oscuro
        },
      },
    },
  };

  return (
    <div className="p-4">
      {error ? (
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Recargar Datos
          </button>
        </div>
      ) : chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p className="text-gray-500">Cargando datos...</p>
      )}
    </div>
  );
};

export default BeverageChart;