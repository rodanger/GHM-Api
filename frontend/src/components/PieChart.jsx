import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/beverages/")
      .then(response => {
        const data = response.data;
        const categoryCounts = {};

        data.forEach(item => {
          categoryCounts[item.Category] = (categoryCounts[item.Category] || 0) + 1;
        });

        setChartData({
          labels: Object.keys(categoryCounts),
          datasets: [{
            label: "Categorías",
            data: Object.values(categoryCounts),
            backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
          }],
        });
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return chartData ? <Pie data={chartData} /> : <p>Cargando datos...</p>;
};

export default PieChart;
