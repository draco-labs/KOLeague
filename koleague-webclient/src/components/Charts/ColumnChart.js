import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ColumnChart = ({dataColumn }) => {
  console.log(dataColumn)
  const sortedData = dataColumn.sort((a, b) => a.timestamp - b.timestamp);
  const dataFormat = sortedData.map((item, index) => {
    if (index === 0) {
      return [
          item.timestamp, 
          0 
      ];
  }
  return [
      item.timestamp, 
      item.oi.toFixed(0) - dataColumn[index - 1].oi.toFixed(0)
  ];
});

  console.log(dataFormat)
  const maxY = Math.max(...dataFormat.map(item => item[1]))*1.01;
  const minY = Math.min(...dataFormat.map(item => item[1]))*0.99;
  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      plotBackgroundColor: '#0d0d15',
      plotBorderWidth: 1,
      plotBorderColor: "#202031",
      height: 225,
    },
    title: {
      text: null,
    },
    xAxis: {
      type: 'datetime',
      visible: false,
      labels: {
        enabled: false,
      },
    },
    yAxis: [
      {
        title: {
          enabled: false,
        },
        labels: {
          style: { color: "#6a6a75" },
        },
        opposite: false,
        gridLineWidth: 0,
        min:minY ,
      max:maxY,
      },
      
    ],
    plotOptions: {
      column: {
        groupPadding: 0, // Adjust this value to control space between column groups
        pointPadding: 0, // Adjust this value to control space between columns
        borderWidth: 0,
        borderRadius: 0,
      },

    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "column",
        name: "Difference_OI",
        data: dataFormat,
        zones: [
          {
            value: 0,
            color: "#e1584B"
          },
          {
            color: "#08EF46"
          }
        ],
        yAxis: 0,
      },

    ],
    tooltip: {
      shared: true,
      backgroundColor: "#2e2e38",
      borderColor: "#00ff00",
      style: {
        color: "#ffffff",
      },
    },
    credits: {
      enabled: false,
    },
  };

  return (
    
    <HighchartsReact highcharts={Highcharts} options={options} />
  )
};

export default ColumnChart;
