$(function() {

  //chart for the preset year analysis data  
  //get data from html (server)
  var tempData = $('#months-payment-data').data('months-payment');
  var monthsPayment = tempData.split(',');
  tempData = $('#months-days-data').data('months-days');
  var monthsDays = tempData.split(',');
  tempData = $('#years-payment-data').data('years-payment');
  var yearsPayment = tempData.split(',');
  tempData = $('#years-days-data').data('years-days');
  var yearsDays = tempData.split(',');
  //chart build
  //present year charts
  var chart1 = c3.generate({
      bindto: '#chart1',
      data: {
        columns: [
          ['payment',0, monthsPayment[1], monthsPayment[2], monthsPayment[3], monthsPayment[4], monthsPayment[5], monthsPayment[6], monthsPayment[7], monthsPayment[8], monthsPayment[9], monthsPayment[10], monthsPayment[11], monthsPayment[12]]
        ]
      },
      axis: {
        x: {
          min: 1,
          tick: {
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          },
          label: {
            text: 'months'
          }
        },
        y: {
          label: {
            text: 'payment',
            position: 'outer-top'
          }
        }
      },
      size: {
        height: 500
      },
      color: {
        pattern: ['#5063f0']
      }
  });
  var chart2 = c3.generate({
      bindto: '#chart2',
      data: {
        columns: [
          ['days',0, monthsDays[1], monthsDays[2], monthsDays[3], monthsDays[4], monthsDays[5], monthsDays[6], monthsDays[7], monthsDays[8], monthsDays[9], monthsDays[10], monthsDays[11], monthsDays[12]]
        ]
      },
      axis: {
        x: {
          min: 1,
          tick: {
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          },
          label: {
            text: 'months'
          }
        },
        y: {
          label: {
            text: 'days',
            position: 'outer-top'
          }
        }
      },
      size: {
        height: 500
      },
      color: {
        pattern: ['#00ABFF']
      }
  });
  //all time charts
  var chart3 = c3.generate({
      bindto: '#chart3',
      data: {
        x: 'x',
        columns: [
          ['x',0, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030], 
          ['payment',0, yearsPayment[1], yearsPayment[2], yearsPayment[3], yearsPayment[4], yearsPayment[5], yearsPayment[6], yearsPayment[7], yearsPayment[8], yearsPayment[9], yearsPayment[10], yearsPayment[11], yearsPayment[12], yearsPayment[13], yearsPayment[14], yearsPayment[15]]
        ]
      },
      axis: {
        x: {
          min: 2016,
          tick: {
            values: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
          },
          label: {
            text: 'years'
          }
        },
        y: {
          label: {
            text: 'payment',
            position: 'outer-top'
          }
        }
      },
      size: {
        height: 500
      },
      color: {
        pattern: ['#5eb1c3']
      }
  });
  var chart4 = c3.generate({
      bindto: '#chart4',
      data: {
        x: 'x',
        columns: [
          ['x',0, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030], 
          ['days',0, yearsDays[1], yearsDays[2], yearsDays[3], yearsDays[4], yearsDays[5], yearsDays[6], yearsDays[7], yearsDays[8], yearsDays[9], yearsDays[10], yearsDays[11], yearsDays[12], yearsDays[13], yearsDays[14], yearsDays[15]]
        ]
      },
      axis: {
        x: {
          min: 2016,
          tick: {
            values: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
          },
          label: {
            text: 'years'
          }
        },
        y: {
          label: {
            text: 'days',
            position: 'outer-top'
          }
        }
      },
      size: {
        height: 500
      },
      color: {
        pattern: ['#7e6cb8']
      }
  });

  //responsive chart height;
  function changeChartHeight(){
    if ($(window).width() <= 500) {
      chart1.resize({height: 300});
      chart2.resize({height: 300});
      chart3.resize({height: 300});
      chart4.resize({height: 300});
    } else {
      chart1.resize({height: 500});
      chart2.resize({height: 500});
      chart3.resize({height: 500});
      chart4.resize({height: 500});
    }
  }
  $(window).ready(changeChartHeight).resize(changeChartHeight);

});