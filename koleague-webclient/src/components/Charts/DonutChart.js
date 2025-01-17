import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Image from "next/image";
import bg from "@/assets/images/new-bg-chart.png"

const colorList = ["#dcf808","#818cf8","#08efe8","#08ef45","#ef4444"];

const DonutChart = ({ tokenList }) => {
  const data = tokenList?.map((token, index) => ({
    name: token.name,
    coin: token.coin,
    y: Number(token.value),
    color: colorList[index],
    icon: token.icon,
  }) || []);

  const highestToken = tokenList.reduce((max, token) => (token.y > max.y ? token : max), tokenList[0]);
  const options = {
    chart: {
      type: 'pie',
      borderRadius: 8,
      backgroundColor: 'transparent',
      height: 250,
   
    },
    title: {
      text: '',
    },
    tooltip: {
      backgroundColor: '#171723', 
      borderColor: '#202031', 
      borderRadius: 6, 
      borderWidth: 1, 
      style: {
        fontFamily: 'Rubik',
        color: '#ffffff',
      },
      formatter: function () {
        const key = this.key || "Other";
        const seriesName = this.series.name;
        const percentage = this.percentage ? this.percentage.toFixed(1) : "0.0";
        return `<b>${key}</b><br>${seriesName}: <b>${percentage}%</b>`;
      },
    },
    plotOptions: {
      pie: {
        innerSize: '75%',
        dataLabels: {
          enabled: false,
          format: '{point.name} <br>{point.percentage:.0f}%',
          style: {
            color: '#ffffff',
            textOutline: 'none',
            fontSize: '14px',
          },
        },
        borderWidth: 0,
      },
    },
    credits: {
      enabled: false, 
    },
    series: [
      {
        name: 'Percentage',
        colorByPoint: true,
        data: data,
      },
    ],
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full" >
      <div className=" rounded-lg h-full w-full" style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        borderColor: "#202031", 
        borderWidth: 1,
        borderRadius: 8,
      }}>
      <HighchartsReact highcharts={Highcharts} options={options}  />
      </div>
      <div className="flex flex-col absolute top-[90px] z-0">
        <span className="text-white text-sm font-medium leading-tight text-center">{highestToken?.coin}</span> 
        {highestToken?.value && <span className="text-center text-[#dcf808] text-2xl font-semibold leading-loose">{(highestToken?.value*100).toFixed(2)}%</span>}
      </div>
      <div className="mt-5  flex flex-col gap-2 w-full">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-start gap-2"
          >
            <div className="flex items-center justify-start gap-1 basis-[40%]">
              {item.icon && (
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={16}
                  height={16}
                  className="w-4 h-4 rounded-full"
                />
              )}
              <div className="text-base font-medium text-[#8f8f9c] leading-normal">{item.name ? item.name : "Other"}</div>
              <div className="text-base font-normal text-white leading-normal ">{item.coin === "Other" ?"": item.coin}</div> 
            </div>
            <div className="flex-1 relative h-2 bg-[#0d0d15] rounded-lg ">
              <div
                style={{
                  width: `${item?.y * 100 || "0"}%`,
                  backgroundColor: item?.color,
                  height: "100%",
                  borderRadius: "8px",
                }}
              ></div>
            </div>
            <div className="text-base font-normal text-[#8f8f9c] leading-normal basis-[15%] text-right">{(item?.y*100).toFixed(2)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
