import React, {useState} from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
const dataColumn = [
  [1672003200000, 0.05 * 1000],
  [1672006800000, 0.1 * 1000],
  [1672010400000, 0.15 * 1000],
  [1672014000000, 0.2 * 1000],
  [1672017600000, 0.3 * 1000],
  [1672021200000, 0.05 * 1000],
  [1672024800000, 0.1 * 1000],
  [1672028400000, 0.15 * 1000],
  [1672032000000, 0.2 * 1000],
  [1672035600000, 0.3 * 1000],
  [1672039200000, 0.05 * 1000],
  [1672042800000, 0.1 * 1000],
  [1672046400000, 0.15 * 1000],
  [1672050000000, 0.2 * 1000],
  [1672053600000, 0.3 * 1000],
  [1672057200000, 0.05 * 1000],
  [1672060800000, 0.1 * 1000],
  [1672064400000, 0.15 * 1000],
  [1672068000000, 0.2 * 1000],
  [1672071600000, 0.3 * 1000],
  [1672075200000, 0.05 * 1000],
  [1672078800000, 0.1 * 1000],
  [1672082400000, 0.15 * 1000],
  [1672086000000, 0.2 * 1000],
  [1672089600000, 0.3 * 1000],
]
const filterTime = ["15m", "1h", "3h", "4h", "24h"]
const CombinedChart = ({  newDataLine }) => {
  const [selectTime, setSelectTime] = useState("24h");


  const tweetData = newDataLine?.[`price_${selectTime}`].find(item => item.tweet_time === 1);
  const tweetTimestamp = tweetData ? tweetData.timestamp : null;
  const formatDataLine = newDataLine?.[`price_${selectTime}`].map((item) => {
    return [
      item.timestamp,
      item.price
    ]
  });
  const maxY = Math.max(...formatDataLine.map(item => item[1])) * 1.01;
  const minY = Math.min(...formatDataLine.map(item => item[1])) * 0.99;
  console.log(newDataLine?.post_url)
  console.log(newDataLine.price, ",", tweetData, ",", formatDataLine, ",", maxY, ",", minY,);
  const options = {
    chart: {
      backgroundColor: "transparent",
      backgroundColor: 'transparent',
      plotBackgroundColor: '#0d0d15',
      plotBorderWidth: 1,
      plotBorderColor: "#202031",
      height: 325,
      marginLeft: 40,
      // marginRight: 40,
    },
    title: {
      text: null,
    },
    xAxis: {
      type: "datetime",
      visible: true,
      labels: {
        enabled: false, 
      },
      crosshair: {
        width: 1,
        color: "##90909C",
        dashStyle: "Dash", 
        zIndex: 5,
      },
      plotLines: [
        {
          color: "#08EFE8", 
          dashStyle: "Dash",
          value: tweetTimestamp,
          width: 2,
          zIndex: 5,
          label: {

            enabled: false,
            visible: false,
          },
        },
      ],
    },
    yAxis: [
      {
        title: {
          text: 'price <br/> ($)',
          style: { color: "#ffffff" },
          align: "high",
          rotation: 0,
          x: -90,
          y: 20
        },
        crosshair: {
          width: 1,
          color: "#90909C",
          dashStyle: "Dash",
          zIndex: 5,
        },
        labels: {
          style: { color: "#6A6A75", fontSize: "12px", fontWeight: "400", lineHeight: "18px" },
        },
        gridLineWidth: 0,
        opposite: false,
        min: minY,
        max: maxY,
      },
    ],
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: [0, 0, 0, 350],
          stops: [
            [0, "rgba(8, 239, 70, 0.5)"],
            [1, "rgba(23, 23, 35, 0)"],
          ],
        },
        marker: {
          enabled: false, 
          states: {
            hover: {
              enabled: true, 
            },
          },
        },
      },
    },
    legend: {
      enabled: false,
      align: "right",
      verticalAlign: "top",
      layout: "vertical",
      borderRadius: 5,
      x: -35,
      y: 10, 
      floating: true,
      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      itemStyle: {
        color: "#ffffff",
      },
    },
    series: [
      // {
      //   type: "column",
      //   name: "Volume",
      //   data: dataColumn,
      //   color: "#1D1D2D",
      //   yAxis: 1,
      // },
      {
        type: "area",
        name: "OI Difference",
        data: formatDataLine,
        color: "#08EF46",
        yAxis: 0,
      },
    ],
    tooltip: {
      useHTML: true,
      stickOnContact: true,
      formatter: function () {
        const isTwitterTime = this.x === tweetTimestamp;
        let tooltipHtml = `<b>${Highcharts.dateFormat("%Y-%m-%d %H:%M", this.x)}</b><br/>`;

        this.points.forEach((point) => {
          tooltipHtml += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b><br/>`;
        });

        if (isTwitterTime) {
          tooltipHtml += `
            <br/>
            <a href=${newDataLine?.post_url} target="_blank" style="color: #08EFE8; cursor: pointer">Twitter</a>
          `;
        }

        return tooltipHtml;
      },
      shared: true,
      zIndex: 10,
      backgroundColor: "#171723",
      borderColor: "#202031",
      borderWidth: 1,
      style: {
        color: "#ffffff",
      },
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="flex flex-col gap-1 px-[24px] py-[12px]" >
      <div className='flex items-center gap-2 text-white font-[500] text-[14px] leading-[20px]'>
        <span className="">Open Interest</span>
        <div className="flex gap-1 border-[1px] border-[#202031] rounded-lg p-1">
          {filterTime.map((item) => (
            <span key={item} className={`${selectTime === item ? "bg-[#08EFE8] text-[#0d0d15]" : "text-[#adadbc]"} inline-block rounded-md p-1 w-[36px] text-center cursor-pointer `} onClick={() => setSelectTime(item)}>{item}</span>
          ))}
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />

    </div>
  )
};

export default CombinedChart;
