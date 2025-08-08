import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/beverages/")
      .then(response => {
        const data = response.data;
        const labels = data.map(item => item.BeverageName);
        const priceValues = data.map(item => parseFloat(item.Price));

        setChartData({
          labels,
          datasets: [{
            label: "Precios",
            data: priceValues,
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
          }],
        });
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return chartData ? <Line data={chartData} /> : <p>Cargando datos...</p>;
};

export default LineChart;
