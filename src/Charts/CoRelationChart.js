import React, { Component } from 'react';
import * as service from '../Services/services';

const ReactHighCharts = require('react-highcharts');

(function (H) {
    var rel = H.relativeLength;
    
        H.wrap(H.seriesTypes.column.prototype, 'translate', function (proceed) {
            var options = this.options,
                topMargin = options.topMargin || 0,
                bottomMargin = options.bottomMargin || 0;
    
            proceed.call(this);
    
            H.each(this.points, function (point) {
               
                var shapeArgs = point.shapeArgs,
                    w = shapeArgs.width,
                    h = shapeArgs.height,
                    x = shapeArgs.x,
                    y = shapeArgs.y;
    
                // Get the radius
                //console.log(options.borderRadiusTopLeft)
                var rTopLeft = rel(options.borderRadiusTopLeft || 0, w),
                    rTopRight = rel(options.borderRadiusTopRight || 0, w),
                    rBottomRight = rel(options.borderRadiusBottomRight || 0, w),
                    rBottomLeft = rel(options.borderRadiusBottomLeft || 0, w);
                if (rTopLeft || rTopRight || rBottomRight || rBottomLeft && typeof point.options.y !== 'undefined') {
                    var maxR = Math.min(w, h) / 2
                    if(point.options.y > 0){
                        
                    if (rTopLeft > maxR) {
                        rTopLeft = maxR;
                    }
    
                    if (rTopRight > maxR) {
                        rTopRight = maxR;
                    }
    
                    if (rBottomRight > maxR) {
                        rBottomRight = maxR;
                    }
    
                    if (rBottomLeft > maxR) {
                        rBottomLeft = maxR;
                    }
    
                    // Preserve the box for data labels
                    point.dlBox = point.shapeArgs;
    
                    point.shapeType = 'path';
                    point.shapeArgs = {
                        d: [
                            'M', x + rTopLeft, y + topMargin,
                            // top side
                            'L', x + w - rTopRight, y + topMargin,
                            // top right corner
                            'C', x + w - rTopRight / 2, y, x + w, y + rTopRight / 2, x + w, y + rTopRight,
                            // right side
                            'L', x + w, y + h - rBottomRight,
                            // bottom right corner
                            'C', x + w, y + h - rBottomRight / 2, x + w - rBottomRight / 2, y + h, x + w - rBottomRight, y + h + bottomMargin,
                            // bottom side
                            'L', x + rBottomLeft, y + h + bottomMargin,
                            // bottom left corner
                            'C', x + rBottomLeft / 2, y + h, x, y + h - rBottomLeft / 2, x, y + h - rBottomLeft,
                            // left side
                            'L', x, y + rTopLeft,
                            // top left corner
                            'C', x, y + rTopLeft / 2, x + rTopLeft / 2, y, x + rTopLeft, y,
                            'Z'
                        ]
                    };
                    }
                    
                }
                if(point.options.y < 0){
                        var rTopLeft = rel(undefined || 0, w),
                        rTopRight = rel(undefined|| 0, w),
                        rBottomRight = rel('25%' || 0, w),
                        rBottomLeft = rel('25%' || 0, w);
                    if (rTopLeft > maxR) {
                        rTopLeft = maxR;
                    }
    
                    if (rTopRight > maxR) {
                        rTopRight = maxR;
                    }
    
                    if (rBottomRight > maxR) {
                        rBottomRight = maxR;
                    }
    
                    if (rBottomLeft > maxR) {
                        rBottomLeft = maxR;
                    }
    
                    // Preserve the box for data labels
                    point.dlBox = point.shapeArgs;
    
                    point.shapeType = 'path';
                    point.shapeArgs = {
                        d: [
                            'M', x + rTopLeft, y + topMargin,
                            // top side
                            'L', x + w - rTopRight, y + topMargin,
                            // top right corner
                            'C', x + w - rTopRight / 2, y, x + w, y + rTopRight / 2, x + w, y + rTopRight,
                            // right side
                            'L', x + w, y + h - rBottomRight,
                            // bottom right corner
                            'C', x + w, y + h - rBottomRight / 2, x + w - rBottomRight / 2, y + h, x + w - rBottomRight, y + h + bottomMargin,
                            // bottom side
                            'L', x + rBottomLeft, y + h + bottomMargin,
                            // bottom left corner
                            'C', x + rBottomLeft / 2, y + h, x, y + h - rBottomLeft / 2, x, y + h - rBottomLeft,
                            // left side
                            'L', x, y + rTopLeft,
                            // top left corner
                            'C', x, y + rTopLeft / 2, x + rTopLeft / 2, y, x + rTopLeft, y,
                            'Z'
                        ]
                    };
                    }
                    
            });
        });
  }(ReactHighCharts.Highcharts));

class CoRelationChart extends Component {

  constructor(props){
    super(props)
  
    this.state = {
      coorelations:{
        chart: {
          type: 'column',
          height: 600,     
          spacingBottom: 15,
          spacingTop: 20,
          spacingLeft: 5,
          spacingRight: 15,
          borderWidth: 1,
          borderColor: '#ddd',
          style: {
            fontFamily: 'sans-serif'
        }
      },
      colors:['#FF5F3F'],
      title: {
          text: ''
      },
      legend: {
          padding: 0,
          margin: 5
      },
      credits: {
          enabled: false
      },
      tooltip: {
          enabled: false
      },
      plotOptions: {
          column: {
              dataLabels: {
                  enabled: true,
                  crop: false,
                  overflow: 'none',
                  format: '{y}%',
                  style:{
                      fontSize:'15px',
                      fontWeight:200
                  }
              }           
          },
          series: {
            borderRadiusTopLeft: '25%',
            borderRadiusTopRight: '25%'
        }
      },
      loading: {
          labelStyle: {
              top: '35%',
          }
      },
      xAxis: {
          categories: [],
          labels:{
            rotation : 90,
            distance:20,
            style:{
              fontSize: '18px',
              color:'#23264F'
            }
          },
          lineWidth:0
      },
      series: [{
          showInLegend: false,
          "data": []
      }],
      yAxis: { 
        labels: {
          formatter: function() {
            return this.value + '%';
          },
          enabled:false
        },
        plotLines: [{
            color: '#000',
            width: 2,
            value: 0,
            zIndex:9999
        }],
        gridLineColor:'transparent',
        title: {
            text: null
        }
      }
      },


      priceCoorelations:{
        chart: {
          type: 'column',
          height: 600,
          spacingBottom: 15,
          spacingTop: 20,
          spacingLeft: 5,
          spacingRight: 15,
          borderWidth: 1,
          borderColor: '#ddd',
          style: {
            fontFamily: 'serif'
        }
      },
      colors:['#23264F'],
      title: {
        text: ''
    },
    legend: {
        padding: 0,
        margin: 5
    },
    credits: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    plotOptions: {
        column: {
            dataLabels: {
                enabled: true,
                crop: false,
                overflow: 'none',
                format: '{y}%',
                style:{
                    fontSize:'15px',
                    fontWeight:200
                }
            }           
        },
        series: {
          borderRadiusTopLeft: '25%',
          borderRadiusTopRight: '25%'
      }
    },
    loading: {
        labelStyle: {
            top: '35%',
        }
    },
    xAxis: {
        categories: [],
        labels:{
          rotation : 90,
          distance:20,
          style:{
            fontSize: '18px',
            color:'#23264F'
          }
        },
        lineWidth:0
    },
    series: [{
        showInLegend: false,
        "data": []
    }],
    yAxis: { 
        labels: {
          formatter: function() {
            return this.value + '%';
          },
          enabled:false
        },
        plotLines: [{
            color: '#000',
            width: 2,
            value: 0,
            zIndex:9999
        }],
        gridLineColor:'transparent',
        title: {
            text: null
        }
      }
      }
    }; 
  }

  componentWillMount(){
      service.getCorelationSales().then((sales)=>{
          let categories = [];
          let values = [];
          sales.data.map((sale)=>{
              categories.push(sale.featureName);
              values.push(Math.round(sale.correlationValue));
          })
          var stateCopy = Object.assign({},this.state);
          stateCopy.coorelations.xAxis['categories'] = categories;
          stateCopy.coorelations.series[0]['data'] = values;
          this.setState({stateCopy});
      })

      service.getCorelationPrice().then((price)=>{
        let categories = [];
        let values = [];
        price.data.map((sale)=>{
            categories.push(sale.featureName);
            values.push(Math.round(sale.correlationValue));
        })
        var stateCopy = Object.assign({},this.state);
        stateCopy.priceCoorelations.xAxis['categories'] = categories;
        stateCopy.priceCoorelations.series[0]['data'] = values;
        this.setState({stateCopy});
    })
  }

  render() {

      return (
        <div>
       <div className="clearfix"><h3>Correlations of Sales and Music Feature <span>:</span></h3></div>
        <div className="empty_d clearfix">
          <h2 className="charts-heading" id="r">Correations between music features and sales</h2>
          <div className="high_c">
          <ReactHighCharts config = {this.state.coorelations}></ReactHighCharts>
          </div>
        </div>

        <div className="clearfix"><h3>Average Price Per Unit and Music Feature Correlations <span>:</span></h3></div>
        <div className="empty_d clearfix">
          <h2 className="charts-heading">Correations between music features and sales</h2>
          <div className="high_c">
          <ReactHighCharts config = {this.state.priceCoorelations}></ReactHighCharts>
          </div>
        </div>
      </div>
      );

      }
}
export default CoRelationChart;
