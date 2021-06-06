import React, { useEffect } from "react";
import IndividualChartContainer from "./IndividualChartContainer";


const ChartsContainer = ({
  allCharts,
  setAllCharts,
  columns,
  setColumns,
  chartName,
  setChartName,
  chart,
  setChart
}) => {
  // placeholder for logic to get all charts from DB to display
  const getAllCharts = async () => {
    await fetch("/dashboard")
    .then(response => response.json())
    .then(data => {
      setAllCharts(data[0].display)
    });
  }

  useEffect(() => {
    getAllCharts();
  }, []);

  const chartsToDisplay = [];
  allCharts.forEach(individualChart => {
    chartsToDisplay.push(
      <IndividualChartContainer
        allCharts={allCharts}
        setAllCharts={setAllCharts}
        columns={columns}
        setColumns={setColumns}
        chartName={individualChart[0].props.id}
        setChartName={setChartName}
        chart={individualChart}
        setChart={setChart}
      />);
  });

  return (
    <div className="charts-container">
      {chartsToDisplay}
    </div>
  )
}

export default ChartsContainer;