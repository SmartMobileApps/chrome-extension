/**
 * @fileoverview Rest Api handler.
 */

'use strict';
var yuno = yuno || {};

/**
 * REST manager API to handle network communctions.
 */
yuno.RESTManager = function() {

  /*
   * Check the session from localStorage/cookies
   * and set the Flag is authaticated.
   */
  var checkSession = function() {
    // TODO(udaykanth): check session is still needs
    //  modification depends on the client site and it session management.
    return yuno.RESTManager.isAuthenticated;
  };

  /**
   * REST function to communicate to server
   * and request required data as response.
   */
  var requestServer = function(config, callback) {
    // TODO(udaykanth): replace this function code with the real
    // REST communication after the live data available.
    mockHTTPRequest(config, callback);
  };

  var mockStatus = 0;
  /**
   * Mock HTTP request object.
   * later to be removed.
   */
  var mockHTTPRequest = function(config, callback) {
    var status = {};
    status['readyState'] = mockStatus;
    status['status'] = (mockStatus != 4) ? 0 : 200;

    if (status['status'] == 200) {
      status['response'] = {};
      if (config['username'] === 'admin' && config['password'] === 'admin') {
        status['response']['success'] = true;
        status['response']['message'] = 'Successfully logged.';
        yuno.RESTManager.isAuthenticated = true;
        chrome.storage.local.set({'isAuthenticated': true}, function() {});
      } else {
        status['response']['success'] = false;
        status['response']['message'] = 'Invalid Credentials.';
        yuno.RESTManager.isAuthenticated = false;
      }
    }
    callback(status);
    mockStatus++;
    if (mockStatus != 5) {
      setTimeout(mockHTTPRequest, 1000, config, callback);
    }
  };

  return {
    checkSession: checkSession,
    requestServer: requestServer
  };
};

/**
 * Global varaible to check user is authanticated.
 */
yuno.RESTManager.isAuthenticated = false;
