import React from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { capitalizeFirstLetter } from '@/utils';

const START_TIME = 1262304000000;

const LineChartHomepage = ({ data, title = "price" }) => {

  const renderdata = () => {
    const out = Array(50).fill(0).map((value, index) => {
      return [
        START_TIME + index * 86400000,
        Math.random(),
      ]
    })
    return out
  }

  const options = {
    chart: {
      type: 'spline',
      height: 500,
      // margin: 55,
      zooming: {
        type: 'x'
      },
      backgroundColor: "#09090B",
      style: {
        color: "#FAFAFA"
      },
      events: {
        load: function () {
          var chart = this;
          var centerX = (chart.plotLeft + chart.plotWidth) / 2;
          var centerY = (chart.plotTop + chart.plotHeight) / 2;

          chart.renderer.text('Portco', centerX, centerY)
            .css({
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'rgba(255, 255, 255, 0.3)'
            })
            .attr({
              align: 'center'
            })
            .add();
        }
      }
    },
    title: {
      text: ''
    },
    xAxis: {
      labels: {
        style: {
          color: '#FAFAFA'
        }
      },
      lineColor: '#1affac',
      lineWidth: 2,
      type: 'datetime',
      crosshair: {
        width: 2,
        color: "#FAFAFA"
      }
    },
    yAxis: {
      title: {
        text: 'Fees',
        style: {
          color: '#FAFAFA'
        }
      },
      labels: {
        style: {
          color: '#FAFAFA'
        }
      },
      gridLineWidth: 0.25,
      // labels: {
      //   format: '{value}°'
      // }
      crosshair: {
        width: 1,
        color: '#FAFAFA',
        dashStyle: 'shortdot',
      }
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      useHTML: true,
      className: 'custom-tooltip ',
      backgroundColor: '#262626',
      borderColor: '#6D6D72',
      borderWidth: 1,
      borderRadius: 6,
      style: {
        fontSize: '16px',
        color: '#FAFAFA'     
         },
      formatter: function () {
        let tooltipContent = `<div><span style="color: #B7B7B9; font-weight: bold; text-transform: uppercase ">${Highcharts.dateFormat('%A, %d %b %Y', this.x)}</span></div><br/>`;
    
        this.points.forEach(point => {
            tooltipContent += `
              <div style="display: flex; justify-content: space-between; gap: 16px; padding: 2px">
                <div style="display: flex; gap: 4px ">
                  <div style="width: 16px; height: 16px; background-color: ${point.color}; border-radius: 4px;""></div>
                  <span style="color: #F7F7F7; font-weight: 600"; text-align: center>${point.series.name}</span>
                </div>
                <span style="color: #FAFAFAfont-weight: 500; text-align: center">${Highcharts.numberFormat(point.y, 2)}</span>
              </div>`;
          
        });
    
        return tooltipContent;
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'top',
      enabled: true,
      itemStyle: {
        color: '#FAFAFA'
      },
      itemHoverStyle: {
        color: '#FAFAFA'

      }
    },
    plotOptions: {
      spline: {
        // lineWidth: 3,
        // states: {
        //   hover: {
        //     lineWidth: 4
        //   }
        // },
        marker: {
          enabled: false
        },
      },
      series: {
        cursor: 'pointer',
        className: 'popup-on-click',
        marker: {
          lineWidth: 1
        }
      }
    },
    series: data.map(item => ({
      name: item.token.toUpperCase(),
      marker: {
        symbol: item.symbol
      },
      data: item.data,
      color: item.color

    })),
    navigator: {
      enabled: true,
      xAxis: {
        labels: {
          style: {
            color: '#FAFAFA' ,
            textOutline: 'none' 
          }
        },
        gridLineWidth: 0.25,
      },
      borderWidth: 0.25,
      handles: {
        backgroundColor: '#FAFAFA',
        borderColor: '#09090B',
      },
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
        color: '#0ea5e9',
        fillOpacity: 0.05,
        lineWidth: 1
      }
    },
    scrollbar: {
      enabled: false,
      barBackgroundColor: '#FAFAFA',
      barBorderRadius: 7,
      barBorderWidth: 0,
      buttonBackgroundColor: '#FAFAFA',
      buttonBorderWidth: 0,
      trackBackgroundColor: 'none',
      trackBorderWidth: 1,
      trackBorderColor: '#FAFAFA',
      trackBorderRadius: 8
    }
  }

  return <HighchartsReact
    highcharts={Highcharts}
    // constructorType={'stockChart'}
    options={options}
  />
}

export default LineChartHomepage;