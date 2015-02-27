/**
 * @fileoverview utility to create charts api.
 */


var yuno = yuno || {};


/**
 * utility for charts
 */
yuno.charts = {
  parseTableToArray: function(table) {
    var myTableArray = [];
    table = $yuno(table);
    var headers = [];
    table.find('th').each(function() {
      headers.push($yuno(this).text());
    });

    if (headers.length > 0) {
      myTableArray.push(headers);
    }


    table.find('tr').each(function() {
      var arrayOfThisRow = [];
      var tableData = $yuno(this).find('td');
      if (tableData.length > 0) {
        tableData.each(function() {
          var value = '' + $yuno(this).text();
          var str = value.trim(); //.replace(/\*/g, '');
          value = parseFloat(str);
          // if (typeof str == 'number') {
          //   value = parseFloat(str);
          // } else {
          //   value = str;
          // }


          if (isNaN(value)) {
            value = str;
          }

          arrayOfThisRow.push(value);
        });
        myTableArray.push(arrayOfThisRow);
      }
    });
    // alert('array generated latest');
    //console.log('array generated');
    //console.log(myTableArray);
    return myTableArray;
  },
  generateBarChart: function(table) {
    // $yuno(document.body).append($yuno('<iframe id="testiframe"/>'));

    yuno.dialog.genChartsPopup(document);
    var array = yuno.charts.parseTableToArray(table);
    var headers = array[0];
    var data = [];

    for (var c = 1; c < headers.length; c++) {
      var dSeries = {
        indexLabelPlacement: 'outside',
        indexLabel: '{y}',
        indexLabelOrientation: 'vertical',
        type: 'column',
        name: headers[c]
      };
      var dataPoints = [];
      for (var r = 1; r < array.length; r++) {
        var point = {};
        point['label'] = array[r][0] + ':' + headers[c];
        point['y'] = array[r][c];
        point['indexLabel'] = headers[c] + ' : ' + array[r][c];
        dataPoints.push(point);
      }
      dSeries['dataPoints'] = dataPoints;
      data.push(dSeries);
    }
    //console.log(data);
    // alert('callling canvas....');

    var chart = new CanvasJS.Chart('yuno-chartID', {
      title: {
        text: document.title
      },
      exportEnabled: true,
      data: data
    });

    //   var chart = new CanvasJS.Chart('yuno-chartID', {
    //     title:{
    //       text: "Fruits sold in First & Second Quarter"
    //     },

    //     data: [  //array of dataSeries
    //     { //dataSeries - first quarter
    //  /*** Change type "column" to "bar", "area", "line" or "pie"***/
    //      type: "column",
    //      name: "First Quarter",
    //      dataPoints: [
    //      { label: "banana", y: 18 },
    //      { label: "orange", y: 29 },
    //      { label: "apple", y: 40 },
    //      { label: "mango", y: 34 },
    //      { label: "grape", y: 24 }
    //      ]
    //    },
    //    { //dataSeries - second quarter

    //     type: "column",
    //     name: "Second Quarter",
    //     dataPoints: [
    //     { label: "banana", y: 23 },
    //     { label: "orange", y: 33 },
    //     { label: "apple", y: 48 },
    //     { label: "mango", y: 37 },
    //     { label: "grape", y: 20 }
    //     ]
    //   }
    //   ]
    // });

    chart.render();

    //   yuno.dialog.genChartsPopup($yuno('#testiframe').contents()[0]);
    //   var frameWindow = document.getElementById('testiframe');
    //   var array = yuno.charts.parseTableToArray(table);
    //   var data = frameWindow.google.visualization.arrayToDataTable(array);
    //   var options = {
    //     title: 'Company Performance',
    //     vAxis: {title: 'Year', titleTextStyle: {color: 'red'}}
    //   };

    //   var chart = new frameWindow.google.visualization.BarChart(
    //     frameWindow.contentDocument.getElementById(yuno.charts.chartID));

    //   chart.draw(data, options);
  }
};
