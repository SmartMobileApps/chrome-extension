/**
 * @fileoverview Download utility to generate and download dynamic files.
 */

var yuno = yuno || {};

/**
 * Utitlty object to generate dynamic file and download.
 */
yuno.download = {
  getWordDocBlob: function(data) {
    var str = "";
    str+="<html " +
      "xmlns:o='urn:schemas-microsoft-com:office:office' " +
      "xmlns:w='urn:schemas-microsoft-com:office:word'" +
      "xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<META content='text/html; charset=utf-8' http-equiv='Content-Type'>"+
      '<head><title>' + data.title + '</title>';

    // str+="<!--[if gte mso 9]>" +
    //   "<xml>" +
    //   "<w:WordDocument>" +
    //   "<w:View>Print</w:View>" +
    //   "<w:Zoom>90</w:Zoom>" +
    //   "<w:DoNotOptimizeForBrowser/>" +
    //   "</w:WordDocument>" +
    //   "</xml>" +
    //   "<![endif]-->";

    str += '<style>' +
      '<!-- /* Style Definitions */' +
      '@page Section1' +
      '   {size:8.5in 11.0in; ' +
      '   margin:1.0in 1.25in 1.0in 1.25in ; ' +
      '   mso-header-margin:.5in; ' +
      '   mso-footer-margin:.5in; mso-paper-source:0;}' +
      ' div.Section1' +
      '   {page:Section1;}' +
      '-->' +
      '</style></head>';

    str += '<body lang=EN-US style=""tab-interval:.5in">' +
      '<div class=Section1>' + data.html +
      '</div></body></html>';

    var blob = new Blob([str], { type: 'application/msword',
                                 endings: 'native' });
    return blob;
  },
  setDownloadDoc: function(data) {
    var blob = yuno.download.getWordDocBlob(data);
    var url = window.URL.createObjectURL(blob);
    var options = {
      url: url,
      filename: data.title + '.doc',
      saveAs: true
    };
    chrome.downloads.download(options, function(downloadID) {
      if (downloadID) {
        console.log('YUNO: Dowloaded the file');
      } else {
        console.error('YUNO: Error downloading the file.');
      }

    });
  }
};
