import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import bg from "@/assets/images/new-bg-chart.png"

const DonutChartWinRate = ({data}) => {
  console.log(data);
  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 228,
      width: 350,
      // margin: [-80, 120, 0, 0],
    },
    title: {
      text: "",
    },
    tooltip: {
      backgroundColor: '#171723', 
      borderColor: '#202031', 
      borderRadius: 6, 
      borderWidth: 1, 
      headerFormat: '',
      enabled: true,
      zIndex: 1000,
      className: 'z-50',
      style: {
        position: 'relative',
        // zIndex: 1000,
        fontFamily: 'Rubik',
        color: "#ffffff",
      },
      pointFormat: `
      <div style="text-align: center; position:relative; z-index:50">
        <span style="color:{point.color}">\u25CF</span> 
        <b>{point.name}</b>: <b>{point.percentage:.0f}%</b>
        </div>
       `,
    },
    plotOptions: {
      pie: {
        innerSize: "75%",
        dataLabels: {
          enabled: false,
          distance: -40,
          format: "{point.name} <br><span style='font-size:18px'>{point.percentage:.0f}%</span>",
          style: {
            color: "#ffffff",
            textOutline: "none",
            fontSize: "14px",
          },
        },
        borderWidth: 0,
        showInLegend: true,
      },
    },
    legend: {
      align: 'right',
      padding: 0,
      verticalAlign: 'middle',
      layout: 'vertical',
      itemStyle: {
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: 'Rubik',
      },

      itemMarginTop: 5, 
      symbolHeight: 14,
      symbolWidth: 14,
      symbolRadius: 3,  
      symbolPadding: 5, 
      itemDistance: 0,


    },
    credits: {
      enabled: false, 
    },
    
    series: [
      {
        name: "Win-Lose Rate",
        colorByPoint: true,
        data: [
          {
            name: "Win Rate",
            y: Number(data),
            color: Number(data) == 0 ?"#4D4D5A": "#08ef46", 
          },
          {
            name: "Lose Rate",
            y: 100-Number(data),
            color: Number(data) == 0 ?"#4D4D5A":"#fc5044", 
          },
        ],
      },
    ],
  };

  return (
    <div >
      {/* Biểu đồ donut */}
      <div style={{
        position: 'relative',
        backgroundImage: `url(${bg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderColor: "#202031", 
        borderWidth: 1,
        borderRadius: 8,
      }}>
        <div className="z-100 relative">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
        <div className="flex flex-col absolute top-[80px] left-[85px] z-0">
          <span className="text-white text-sm font-medium leading-tight text-center">Win Rate</span> 
          <span className={`text-center ${data.length===0?"text-[#4D4D5A]" : "text-[#08ef46]"} text-2xl font-semibold leading-loose`}>{data.length === 0 ? "0" : data}%</span>
        </div>
        
      </div>
    </div>
  );
};

export default DonutChartWinRate;
