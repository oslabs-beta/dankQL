import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import OptionsOrSelectedColumn from "./OptionsOrSelectedColumn";
import TimeSeriesChart from "./TimeSeriesChart";
import history from "./dashboardHistory";




const ChartSetup = ({
  chartSetupComponent,
  setChartSetupComponent,
  allCharts,
  setAllCharts
}) => {
  const initialColumns = {
    aggregationOptions: {
      name: "aggregationOptions",
      title: "Aggregation Options",
      list: ["sum", "average", "multiply", "divide", "minimum", "maximum"] // placeholder for prometheus data
    },
    aggregationSelected: {
      name: "aggregationSelected",
      title: "Aggregation Selected",
      list: []
    },
    metricsOptions: {
      name: "metricsOptions",
      title: "Metrics Options",
      list: ["database", "server"] // placeholder for prometheus data
    },
    metricsSelected: {
      name: "metricsSelected",
      title: "Metrics Selected",
      list: []
    }
  };

  const [columns, setColumns] = useState(() => initialColumns);
  const [chartName, setChartName] = useState(() => "");
  const [chart, setChart] = useState(() => []);

  const onDragEnd = ({ source, destination }) => {
    if (destination === undefined || destination === null) return;

    if (source.droppableId === destination.droppableId && destination.index === source.index) return;

    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    if (start === end) {
      const updatedList = start.list.filter((item, index) => index !== source.index);
      updatedList.splice(destination.index, 0, start.list[source.index]);
      const updatedColumn = {
        ...start,
        list: updatedList
      };
      const updatedState = {
        ...columns,
        [updatedColumn.name]: updatedColumn
      }
      setColumns(updatedState);
      return;
    } else {
      const updatedStartList = start.list.filter((item, index) => index !== source.index);
      const updatedStartColumn = {
        ...start,
        list: updatedStartList
      };
      const updatedEndList = end.list;
      updatedEndList.splice(destination.index, 0, start.list[source.index]);
      const updatedEndColumn = {
        ...end,
        list: updatedEndList
      };
      const updatedState = {
        ...columns,
        [updatedStartColumn.name]: updatedStartColumn,
        [updatedEndColumn.name]: updatedEndColumn
      }
      setColumns(updatedState);
      return;
    }
  }

  const changeChartName = (event) => {
    setChartName(event.target.value);
  }
  
  const saveChartSetup = () => {
    console.log(columns); // placeholder for logic to send current state of columns to DB
    console.log(chartName); // placeholder for logic to send current state of columns to DB
    const newChart = [<TimeSeriesChart />]
    setChart(newChart);
    const updatedAllCharts = allCharts.slice();
    updatedAllCharts.push(newChart);
    setAllCharts(updatedAllCharts);
    // post request to update all charts in DB
  }

  const closeChartSetup = () => {
    setChartSetupComponent([]);
    history.push("/");
  }
  

  return (
      <div className="dashboard-setup">
        Chart Name: <input type="text" onChange={changeChartName}></input>
        <DragDropContext onDragEnd={onDragEnd}>
            {Object.values(columns).map((column, index) => (
              <OptionsOrSelectedColumn
                key={`column${index}`}
                columnName={column.name}
                columnTitle={column.title}
                listOfOperatorsOrMetrics={column.list} 
              />
            ))}
        </DragDropContext>
        <button id="save-chart-setup" onClick={saveChartSetup}>Save</button> <button id="close-chart-setup" onClick={closeChartSetup}>Close</button>
        {chart}
      </div>
  )
}

export default ChartSetup;