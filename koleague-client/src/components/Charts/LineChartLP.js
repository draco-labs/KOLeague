import React, {useState} from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LineChart = ({recentMatches}) => {
    
    const [hoveredValue, setHoveredValue] = useState(null);
    const matches = Array.isArray(recentMatches) ? recentMatches : [];

    const maxY = Math.max(...matches)+100;
    const minY = Math.min(...matches)-100;
    
  const options = {
    chart: {
      type: "area",
      backgroundColor: "#0d0d15",
      height: 230 ,    
      borderColor: "#202031", // Màu viền
      borderWidth: 1,
      borderRadius: 8,
      margin: [0, 0, 0, 0],
    },
    title: {
      text: "",
    },
    credits:{
        enabled: false,
    },
    xAxis: {
      visible: false, // Ẩn trục X hoàn toàn
      labels: {
        enabled: false, // Tắt nhãn trục X
      },
      lineWidth: 0, // Không vẽ đường trục X
      tickWidth: 0, // Ẩn các dấu tick
    },
    yAxis: {
      title: {
        text: "",
      },
      gridLineColor: "#2A2A38",
      gridLineDashStyle: "ShortDot",
      gridLineWidth: 0,
      labels: {
        enabled: false,
        formatter: function () {
          return `${Math.round(this.value)} LP`; // Hiển thị đơn vị LP
        },
        style: {
          color: "#FFFFFF",
          fontSize: "12px",
        },
      },
      min: minY,
      max: maxY,
    },
    legend: {
        enabled: false,
    },
    tooltip: {
      backgroundColor: '#171723', 
      borderColor: '#202031', 
      borderRadius: 6, 
      borderWidth: 1, 
      headerFormat: '',
      style: {
        fontFamily: 'Rubik',
        color: '#ffffff',
      },
      pointFormat: `<b>{point.y} LP</b>`,
    },
    plotOptions: {
      area: {
        lineWidth: 2,
        marker: {
          enabled: false, // Ẩn các nốt
          states: {
            hover: {
              enabled: true, // Hiện các nốt khi trỏ vào
            },
          },
          radius: 5,
          symbol: "circle",
          fillColor: "#171723",
          lineColor: "#08EF46",
          lineWidth: 2,
        },
        fillColor: {
          linearGradient: [0, 0, 0, 300],
          stops: [
            [0.25, "rgba(8, 239, 70, 0.5)"], 
            [0.75, "rgba(23, 23, 35, 0)"],
         
          ],
        },
        // events: {
        //   mouseOver: function () {
        //     setHoveredValue(null); // Xóa giá trị khi trỏ ra ngoài biểu đồ
        //   },
        // },
      },
      series: {
        point: {
          events: {
            mouseOver: function () {
              setHoveredValue(this.y); 
            },
          },
        },
      },
    },
    series: [
      {
        name: "LP",
        data: recentMatches,
        color: "#08EF46", 
      },
    ],
  };

  return (
    <div className="relative min-[1920px]:max-w-full h-full ">
      <HighchartsReact highcharts={Highcharts} options={options} />
      {hoveredValue !== null && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "transparent",
            color: "#ffffff",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          {hoveredValue} <span className="text-[#dcf808]"> LP </span>
          <br/>
          <span className={`text-[14px] leading-5 font-[500px] ${hoveredValue-matches[0]>0?"text-[#08EF46]":"text-[#E1584B]"} ${hoveredValue-matches[0]==0 && "hidden"} `}>{hoveredValue-matches[0]>0?"+":""}{((hoveredValue-matches[0])/matches[0]*100).toFixed(2)}%</span>
        </div>
      )}
    </div>
  );
};

export default LineChart;
