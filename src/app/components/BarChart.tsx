"use client";

import { Bar } from "react-chartjs-2";
import { Course } from './SideBar'; // Ensure Course includes the grades properties
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the props type for the BarChart component
interface BarChartProps {
  grades: Course;
}

// Update the component to accept the correct props type
const BarChart = ({ grades }: BarChartProps) => {
  // Prepare the grade data and labels
  const gradeLabels = ["A", "B", "C", "D", "F", "I", "P", "Q", "W", "Z", "R"];
  const gradeValues = [
    grades.grades_A,
    grades.grades_B,
    grades.grades_C,
    grades.grades_D,
    grades.grades_F,
    grades.grades_I,
    grades.grades_P,
    grades.grades_Q,
    grades.grades_W,
    grades.grades_Z,
    grades.grades_R,
  ];

  // Filter out grades that are 0
  const filteredLabels: string[] = [];
  const filteredData: number[] = [];

  gradeValues.forEach((value, index) => {
    if (value > 0) {
      filteredLabels.push(gradeLabels[index]);
      filteredData.push(value);
    }
  });

  const data = {
    labels: filteredLabels,
    datasets: [
      {
        label: "Number of Students",
        data: filteredData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // make it a const to fix type checking
      },
      title: {
        display: true,
        text: "Grade Distribution",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
