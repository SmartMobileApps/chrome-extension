/*jshint -W082 */
/*jshint -W030 */

/**
 * @fileoverview content script to handle DOM data of the current active tab.
 *
 */

'use strict';

var yuno = yuno || {};

/**
 * Content script initializaion.
 */
yuno.contentScript = {

  getXPath: function(element) {
    var xpath = '';
    for (; element && element.nodeType === 1; element = element.parentNode) {
      //alert(element);
      var id = $yuno(
        element.parentNode).children(element.tagName).index(element) + 1;

      id > 1 ? (id = '[' + id + ']') : (id = '');
      xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    return xpath;
  },
  interval: 0,
  init: function() {

    /* Listen for messages */
    chrome.runtime.onMessage.addListener(function(msg) { // sender, sendResponse

      /* If the received message has the expected format... */
      if (msg.type && (msg.type === 'login')) {

        yuno.dialog.init(msg.html, false);

      } else if (msg.type && (msg.type === 'loginres')) {

        yuno.dialog.message(msg.response.message, 'red');
        if (msg.response.success) {
          $yuno('#fade').remove();
          $yuno('#' + yuno.dialog.loginDialogID).remove();
        }
      } else if (msg.type && (msg.type === 'login_loading')) {

        yuno.dialog.message('connecting server status: ' +
                            msg.readyState, 'orange');
      } else if (msg.type && (msg.type === 'saveToTemplate')) {

        yuno.dialog.init(msg.html, true);
      } else if (msg.type && (msg.type === 'exportChart1')) {
        var s1 = window.getSelection();
        if (s1.toString() && s1.toString().length > 0) {
          var parent1 = s1.anchorNode.parentNode;
          var ctr = 4;
          while (parent1 != null && parent1.tagName != 'TABLE' && ctr > 0) {
            ctr++;
            parent1 = parent1.parentNode;
          }

          if (parent1 != null && parent1.tagName === 'TABLE') {
            // export logic to charts here.
            // alert('Table object selected.2.');
            console.log('Table selected..');
            console.log(parent1);
              yuno.charts.generateBarChart(parent1);

          } else {
            alert('Selected text is not in a table.');
          }
        } else {
          alert('Select some text in a table to select its entire table');
        }

      } else if (msg.type && (msg.type === 'download')) {

        var s = window.getSelection();
        if (s.toString() && s.toString().length > 0) {
          var selection = s.toString();
          var parent = s.anchorNode.parentNode;
          var xpath = yuno.contentScript.getXPath(parent);
          var title = document.title;
          var html = '';

          html += ' <h1 align="center">' + title + '</h1>';
          html += '<br\>';
          html += '<br\>';
          html += '<h3>URL:</h3>';
          html += '<p>' + document.URL + '</p>';
          html += '<h3>XPATH:</h3>';
          html += '<p>' + xpath + '</p>';
          html += '<h3>Selected Text:</h3>';
          html += '<p>' + selection + '</p>';
          html += '<br\>';
          html += '<br\>';
          html += '<h3 align="center">Document ' +
            'created by YUNO chrome extension.</h3>';



          // yuno.download.setDownloadDoc(s.toString());
          var config = {
            'type': 'download',
            'data': {'title': title, 'html': html}
          };

          chrome.runtime.sendMessage(config, function(response) {
            console.log(response);
          });
        } else {
          alert('Please select some text');
        }
      }
    });
  }
};

yuno.contentScript.init();
