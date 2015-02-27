/**
 * @fileoverview Rest Api handler.
 */

'use strict';
var yuno = yuno || {};

/**
 * REST manager API to handle network communctions.
 */
yuno.RESTManager = function() {
  var baseURL = "http://yuno.herokuapp.com";
//  var baseURL = "http://localhost:3000";

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

  var userAuth = function(config,callback){
    var status = {'status':200,'readyState':0};
    status['response'] = {};
    var loginReq = $yuno.post(baseURL+"/auth/signin",config);
    loginReq.done(function(data){
      status['status'] = 200;
      status['readyState'] = 4;
      yuno.RESTManager.isAuthenticated = true;
      yuno.RESTManager.userId = data['_id'];
      status['response']['success'] = true;
      status['response']['message'] = 'Successfully logged.';
      chrome.storage.local.set({'isAuthenticated': true}, function() {});
      chrome.storage.local.set({'userId': data['_id']}, function() {});
    })
    loginReq.fail(function(data){
      status['status'] = 400;
      yuno.RESTManager.isAuthenticated = false;
      status['response']['success'] = false;
      status['response']['message'] = "Unknown user or invalid password";
    })
    loginReq.always(function(){
      callback(status);
    })
  }
  var userSignOut = function(config,callback){
    $.get(baseURL+"/auth/signout");
    var status = {'status':200,'readyState':4,'response':{'success':true,'message':"Logout Successfull"}};
    callback(status);
  }

  var templateSave = function(config,callback){
    var status = {'status':200,'readyState':4};
    status['response'] = {};
    chrome.storage.local.get('userId', function(user) {
      var data = {
        '_id':user.userId,
        'template':{
          'title':config.title,
          'selection':config.content,
          'xpath':config.xpath,
          'url':config.url
        }
      }
      var saveReq = $yuno.post(baseURL+"/api/v1/save",data);
      saveReq.done(function(data){
        status['response']['success'] = true;
        status['response']['message'] = "Successfully added template";
      });
      saveReq.fail(function(data){
        status['response']['success'] = false;
        status['response']['message'] = "No agent set to record";
      });
      saveReq.always(function(data){
        status['status'] = data.status;
        status['readyState'] = data.readyState;
        callback(status)
      });
    });
  }
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
    requestServer: requestServer,
    userAuth: userAuth,
    templateSave: templateSave,
    userSignOut:userSignOut
  };
};

/**
 * Global varaible to check user is authanticated.
 */
yuno.RESTManager.isAuthenticated = false;
