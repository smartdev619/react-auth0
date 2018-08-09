import React, { Component } from 'react';
import {Bar, Radar,Line} from 'react-chartjs-2';
import { Chart } from 'react-google-charts';
import loading from '../Callback/Spinner.gif';
import {Chart as chartjs} from 'react-chartjs-2';
import RecentTracks from './RecentTracks';
import MusicBaselineGeneral from './MusicBaselineGeneral';
import moment from 'moment';
import CoRelationChart from './CoRelationChart'
import * as service from '../Services/services';

const google = window.google;

class Charts extends Component {

  constructor(props){
    super(props);
    this.state={
      loader:true,
      start_date:'',
      end_date:'',
    baselineMorning:{
      data:{
        labels: [],
        datasets: [
          {
            label: 'Morning',
            backgroundColor: 'rgba(172,159,184,0.8)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#272A51',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: []
          }
        ]
    },
  },
  baselineGeneral:{
    data:{
      labels: [],
      datasets: [
        {
          label: 'Avg',
          backgroundColor: 'rgba(252,107,87,0.8)',borderColor: "rgba(179,181,198,1)",
          borderColor: "rgba(252,107,87,0)",
          data: []
        },
      ]
  },
},
  baselineAfternoon:{
    data:{
      labels: [],
      datasets: [
        {
          label: 'Afternoon',
          backgroundColor: 'rgba(172,159,184,0.8)',
          pointBackgroundColor: 'rgba(179,181,198,1)',
          pointBorderColor: '#272A51',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(179,181,198,1)',
          data: []
        }
      ]
  },
},
  tracksDurationData:[],
  tracksLoudnessData:[],
  tracksTempoData:[],
  payment:{
    data:{
      labels: [],
      datasets: [
        {
          label: 'Average Purchase Value',
          fill: true,
          backgroundColor:'#FA836F',
          data: []
        }
      ]
    }
  },
  averageItemPurchased:{
    data:{
      labels: [],
      datasets: [
        {
          label: 'Average Item Purchased',
          fill: true,
          backgroundColor:'#FA836F',
          data: []
        }
      ]
    }
  },
  averagePricePurchased:{
    data:{
      labels: [],
      datasets: [
        {
          label: 'Average Price Purchased',
          fill: true,
          backgroundColor:'#FA836F',
          data: [],
        }
      ]
    }
  },
      options:{
        tooltips: {

        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: false,
            beginAtZero: true,
            ticks: {
                stepSize: 1,
                min: 0,
                autoSkip: false,
            }
        }]
      }
    },
    paymentOptions:{
      legend: {
        display: false,
    },
      tooltips: {
        callbacks: {
          title: function(tooltipItem, data) {
            return data['labels'][tooltipItem[0]['index']];
          },
          afterBody: function(tooltipItem, data) {
            let price = data['datasets'][0]['data'][tooltipItem[0]['index']];
            return '$'+price.toFixed(2);
        },
        label :function(tooltipItem, data) {
          return
        }
      },
        backgroundColor : '#fff',
        titleFontColor : '#60637E',
        titleFontSize:14,
        bodyFontColor : '#000',
        bodyFontSize:30,
        bodySpacing:4,
        titleMarginBottom:5,
        xPadding:30,
        yPadding:20,
        titleFontStyle:'200',
        bodyFontStyle:'200'

      },
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                callback: function(label, index, labels) {
                  return '$'+label;
              }
            },
        }],
        xAxes: [{
          stacked: false,
          beginAtZero: true,
          ticks: {
              stepSize: 1,
              min: 0,
              autoSkip: false
          }
      }]
    }
  },
  itemPurchasedOptions:{
    tooltips: {
      enabled:false,
    },
    scales: {
      xAxes: [{
        stacked: false,
        beginAtZero: true,
        ticks: {
            stepSize: 1,
            min: 0,
            autoSkip: false
        }
    }]
  },
  legend: {
    display: false,
  }
},
  radarOptions:{
    tooltips: {
                enabled:false,
                custom: function(tooltipModel) {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        document.getElementById('tooltip').innerHTML = '';
                        document.getElementById('tooltip').style.boxShadow = ''
                        return;
                    }
                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        let titleName = '';
                        titleLines.forEach(function(title) {
                            titleName = title;
                        });
                        let html = '';
                        let labels = JSON.parse(localStorage.getItem('labels'));
                        let data = JSON.parse(localStorage.getItem('data'));
                        for(var i=0; i < labels.length;i++){
                              let activeclass = '';
                              if(titleName === labels[i]){
                              activeclass = 'activetooltip';
                              }
                            html += '<li class="'+activeclass+'">'+labels[i]+' - '+data[i].toFixed(2)+'</li>';
                        }
                        document.getElementById('tooltip').innerHTML = html;
                        document.getElementById('tooltip').style.boxShadow = '0px 1px 16px 2px #f3f3f3'
                    }
                }},
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    scale: {
    pointLabels: {
      fontSize: 14,
  },
      ticks: {
            beginAtZero: true,
            userCallback: function (value, index, values) {
                return '';
            }
        }
    }
      }
    }

  this.getBaseLineChart = this.getBaseLineChart.bind(this);
  this.getPaymentChart = this.getPaymentChart.bind(this);
  this.getFeaturesChart = this.getFeaturesChart.bind(this);
  }

  componentWillReceiveProps(props){
    let from_date = moment(props.start_date).format('YYYY-MM-DD');
    let to_date = moment(props.end_date).format('YYYY-MM-DD');

    if(this.state.start_date !== from_date || this.state.to_date !== to_date){
      this.getBaseLineChart(from_date,to_date);
      this.getPaymentChart(from_date,to_date);
      this.setState({start_date:from_date,to_date:to_date});
    }
    this.getFeaturesChart(from_date,to_date);


  }


  componentDidMount(){
            let from_date = moment(this.props.start_date).format('YYYY-MM-DD');
            let to_date = moment(this.props.end_date).format('YYYY-MM-DD');
            this.getBaseLineChart(from_date,to_date);
            this.getPaymentChart(from_date,to_date);
            this.getFeaturesChart(from_date,to_date);
  }



  getFeaturesChart = (from,to)=>{
    this.setState({loader : true})
    service.getFeatures(from,to).then((result)=>{
      let dataDuration = result.data.duration;
      let dataLoudness = result.data.loudness;
      let dataTempo = result.data.tempo;
      this.setState({
        tracksDurationData:['Duration',0,dataDuration.avg/60,dataDuration.min/60,dataDuration.max/60],
        tracksTempoData:['Tempo',0,dataTempo.avg,dataTempo.min,dataTempo.max],
        tracksLoudnessData:['Loudness',0,dataLoudness.avg,dataLoudness.min,dataLoudness.max]
      });
      this.setState({loader : false})

    }).catch((e)=>{
      console.log('error',e)
      this.setState({loader : false})
    })
  }

  getPaymentChart = (from,to)=>{
          service.getPayments(from,to).then((result)=>{
            let labels = [];
            let data = [];
            let averageItemPurchasedData = [];
            let averagePricePurchasedData = [];
            result.data.map((item)=>{
              labels.push(item.day.substring(0, 3));
              data.push(item.averageSale);
              averageItemPurchasedData.push(item.averageItemsPurchased);
              averagePricePurchasedData.push(item.averageItemPrice);
            })
            var stateCopy = Object.assign({},this.state);
            stateCopy.payment.data['labels'] = labels;
            stateCopy.payment.data.datasets[0]['data'] = data;

            stateCopy.averageItemPurchased.data['labels'] = labels;
            stateCopy.averageItemPurchased.data.datasets[0]['data'] = averageItemPurchasedData;

            stateCopy.averagePricePurchased.data['labels'] = labels;
            stateCopy.averagePricePurchased.data.datasets[0]['data'] = averagePricePurchasedData;
            this.setState({stateCopy})
      }).catch((e)=>{
        console.log('error',e)
      })
  }

  getBaseLineChart = (from,to)=>{
    service.getMusicBaseline(from,to).then((result)=>{
       let labels = [];
       let afternoonValues = [];
       let morningValues = [];
       let generalAvgValues = []
       let afterNoonData = result.data.afternoon;
       let morningData = result.data.morning;
       let generalData = result.data.general;
       for (var key in afterNoonData) {
         if (afterNoonData.hasOwnProperty(key)) {
             labels.push(key)
             afternoonValues.push(afterNoonData[key].avg);
         }
        }

        for (var key in morningData) {
         if (morningData.hasOwnProperty(key)) {
           morningValues.push(morningData[key].avg);
         }
        }

        for (var key in generalData) {
          if (generalData.hasOwnProperty(key)) {
              generalAvgValues.push(generalData[key].avg);
          }
         }

     var stateCopy = Object.assign({},this.state);
     stateCopy.baselineMorning.data['labels'] = labels;
     stateCopy.baselineMorning.data.datasets[0]['data'] = morningValues;
     stateCopy.baselineAfternoon.data['labels'] = labels;
     stateCopy.baselineAfternoon.data.datasets[0]['data'] = afternoonValues;

     stateCopy.baselineGeneral.data['labels'] = labels;
     stateCopy.baselineGeneral.data.datasets[0]['data'] = generalAvgValues;
     localStorage.setItem('labels',JSON.stringify(labels));
     localStorage.setItem('data',JSON.stringify(generalAvgValues));
     this.setState({stateCopy})
     }).catch((e)=>{
       console.log('error',e)
     })

  }


  render() {
    const style = {
      position: 'absolute',
      justifyContent: 'center',
      textAlign:'center',
      top: '30%',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }
    if(!this.state.loader){
      return (
        <section className="container-fluid wd">
        <div className="inner_section">
          <RecentTracks/>
          <CoRelationChart/>


        <div className="clearfix"><h3>Music Baseline Analysis (General) <span>:</span></h3></div>

          <MusicBaselineGeneral general={this.state.baselineGeneral.data} onDateFilter={this.getBaseLineChart.bind(this)} options={this.state.radarOptions}/>

        <div className="empty_d clearfix empt">
          <div className="col-sm-4 cont3 pull-left">
            <h2 className="charts-heading">Track durations (minutes)</h2>
            {this.state.tracksDurationData.length > 0?<Chart
              chartType="ComboChart"
              rows={[this.state.tracksDurationData]}
              columns={[
                {type: 'string'},
                {type: 'number'},
                {type: 'number'},
                {type: 'number', role: 'interval'},
                {type: 'number', role: 'interval'},
              ]
              }
              options={{
                isStacked: true,
                seriesType: "bars",
                colors:["#FE826A"],
                hAxis: { textPosition: 'none' },
                legend: {position: 'none'},
                series: {0: {color: 'transparent'} ,2: {type: "line"}},
                'tooltip' : {
                  trigger: 'none'
                }
              }}
              width="100%"
              height="600px"
            />:''}

          </div>
          <div className="col-sm-4 cont3 cont4">
            <h2 className="charts-heading">Loudness (dBs)</h2>
          {this.state.tracksLoudnessData.length > 0?<Chart
            chartType="ComboChart"
            rows={[this.state.tracksLoudnessData]}
            columns={[
              {type: 'string'},
              {type: 'number'},
              {type: 'number'},
              {type: 'number', role: 'interval'},
              {type: 'number', role: 'interval'},
            ]
            }
            options={{
              isStacked: true,
              seriesType: "bars",
              colors:["#FE826A"],
              hAxis: { textPosition: 'none' },
              legend: {position: 'none'},
              series: {0: {color: 'transparent'}, 2: {type: "line"}},
              'tooltip' : {
                trigger: 'none'
              }
            }}
            width="100%"
            height="600px"
          />:''}
          </div>
          <div className="col-sm-4 cont3 pull-right">
          <h2 className="charts-heading">Tempo (bpm)</h2>
          {this.state.tracksTempoData.length > 0?
            <Chart
            chartType="ComboChart"
            rows={[this.state.tracksTempoData]}
            columns={[
              {type: 'string'},
              {type: 'number'},
              {type: 'number'},
              {type: 'number', role: 'interval'},
              {type: 'number', role: 'interval'},
            ]
            }
            options={{
              isStacked: true,
              seriesType: "bars",
              colors:["#FE826A"],
              hAxis: { textPosition: 'none' },
              legend: {position: 'none'},
              series: {0: {color: 'transparent'}, 2: {type: "line"}},
              'tooltip' : {
                trigger: 'none'
              }
            }}
            width="100%"
            height="600px"
          /> :''}
          </div>
        </div>

        <div className="clearfix"><h3>Music Baseline Analysis (By Time of Day) <span>:</span></h3></div>
        <div className="empty_d clearfix empt chart-res">
        <div className="col-sm-6 cont1">
        <div className="cont">
          <Radar data={this.state.baselineMorning.data} width={400} height={400} options={this.state.radarOptions}/>
        </div>
        <h3>Morning <span>6:00am - 11:59pm</span></h3>
        </div>
        <div className="col-sm-6 cont1 cont2">
        <div className="cont">
          <Radar data={this.state.baselineAfternoon.data} width={400} height={400} options={this.state.radarOptions}/>
        </div>
        <h3>Afternoon <span>12:00pm - 05:30pm</span></h3>
      </div>

        </div>

        <div className="clearfix"><h3>Sales Statistics <span>:</span></h3></div>
        <div className="empty_d clearfix empt h-height">
          <div className="col-sm-4 cont3 pull-left">
          <h2 className="charts-heading">Average Purchase Value</h2>
            <Line data={this.state.payment.data}  height={200} options={this.state.paymentOptions}/>
          </div>
          <div className="col-sm-4 cont3 cont4">
          <h2 className="charts-heading">Average # of Items Purchased</h2>
           <Line data={this.state.averageItemPurchased.data} height={200} options={this.state.itemPurchasedOptions}/>
          </div>
          <div className="col-sm-4 cont3 pull-right">
          <h2 className="charts-heading">Average Price per Item Purchased</h2>
            <Line data={this.state.averagePricePurchased.data}  height={200} options={this.state.paymentOptions}/>
          </div>
        </div>
        </div>
      </section>
      );
    }else {
      return (
        <div style={style}>
          <img style={{width:'auto'}}src={loading} alt="loading"/>
        </div>
      );
    }

      }


}
export default Charts;
