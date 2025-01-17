import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { convertDate } from '@/utils';
import iconBTC from '@/assets/images/new-icon-BTC.svg';

const LineChartMatch = ({data, result}) => {
  const convertData = (dataBase) => {
    return dataBase.map(item => 
      ([
        new Date(item.time).getTime(), 
        item.value, 
        { custom: item.icon } 
      ]))
  };
      
  const chartData = convertData(data || []);

  const maxY = Math.max(...chartData.map(item => item[1]))*1.01;
  const minY = Math.min(...chartData.map(item => item[1]))*0.99;
  
  const fillColor = result
  ? {
      linearGradient: [0, 0, 0, 130],
      stops: [
        [0.25, "rgba(8, 239, 70, 0.5)"],
        [0.75, "rgba(23, 23, 35, 0)"],
      ],
    }
  : {
      linearGradient: [0, 0, 0, 130],
      stops: [
        [0.25, "rgb(225, 88, 75, 0.5)"],
        [0.75, "rgba(23, 23, 35, 0)"],
      ],
    };

  const options = {
    chart: {
      type: 'area',
      height: 100,
      backgroundColor: '#09090B',
      borderRadius: 8,
      padding: 0,
      margin: 0,
      
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      visible: false,
      labels: {
        enabled: false,
      },    
      lineColor: '#FF4D4D',
      lineWidth: 1,
    },
    legend: {
        enabled: false,
    },
    yAxis: {
      title: {
        text: '',
      },
      labels: {
        enabled: false,
        style: {
          //color: '#FAFAFA',
        },
      },
      min:minY ,
      max:maxY,
      gridLineWidth: 0,
    },
    tooltip: {
      backgroundColor: '#171723', 
      borderColor: '#202031', 
      borderRadius: 6, 
      borderWidth: 1, 
      headerFormat: '',
      style: {
        fontFamily: 'Rubik',
      },
      pointFormatter: function () {
         return `
          <div style="text-align: left, font-family: Rubik ">
            <div style="color: #FFFFFF;  font-size: 14px; font-weight:600; line-height:20px">$${this.y}</div>
            <br/>
            <div style="color: #90909C; font-size: 12px; font-weight:400; line-height:18px">${convertDate(this.x)}</div>
          </div>
        `;
      },
    },
    
    credits: {
      enabled: false,
    },
    plotOptions: {
      area: {
        fillColor: fillColor, 
        lineWidth: 2,
        marker: {
          enabled: false,
        },
        dataLabels: {
          enabled: true,
          useHTML: true,
          align: 'center', 
          verticalAlign: 'middle', 
          x: 0, 
          y: -5, 
          formatter: function () {
            const icon = chartData.find(item => item[0] === this.x)?.[2]?.custom;
            return icon
              ? `<h1 style="color: #09090b; display: inline-block;
    width: 20px;">.</h1><img src="${icon}" alt="icon" style="border-radius:50%; width: 20px; height: 20px;" />`
              : null;
          },
        },
        
      },
    },
    series: [
      {
        name: 'Price',
        data: chartData,
        color: result ? '#08EF46' : "#E1584B",
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChartMatch;
