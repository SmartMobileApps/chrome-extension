'use strict';

// chrome.runtime.onInstalled.addListener(function(details) {
//   console.log('previousVersion', details.previousVersion);
// });

var yuno = yuno || {};

/**
 * Background script initialization.
 */
yuno.background = {
    init: function() {

        chrome.storage.local.get('isAuthenticated', function(value) {

            if (value.isAuthenticated) {
                yuno.RESTManager.isAuthenticated = value.isAuthenticated;
            }
            yuno.singletonMenus.createMenuItems();

        });


        chrome.runtime.onMessage.addListener(
            function(request) { //, sender, sendResponse
                if (request.type === 'login') {
                    yuno.RESTManager().userAuth(request, yuno.background.callback);

                } else if (request.type === 'saveToTemplate') {
                    yuno.RESTManager().templateSave(request, yuno.background.saveTempCall);
                } else if (request.type === 'download') {
                    yuno.download.setDownloadDoc(request.data);
                }
            });

    },
    sendMessage: function(message, responseCallback) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, responseCallback);
        });
    },
    callback: function(status) {
        //  alert('status: ' + status['readyState']);
        var message = {};
        if (status.readyState === 4 && status.status === 200) {
            if (status.response.success) {
                message = {
                    'type': 'loginres',
                    'response': status.response
                };
                // messageObj.innerText = status.response.message;
                yuno.background.sendMessage(message, function(response) {
                    // console.log(response);
                });

                yuno.singletonMenus.createMenuItems();
            } else {
                message = {
                    'type': 'loginres',
                    'response': status.response
                };
                // messageObj.innerText = status.response.message;
                yuno.background.sendMessage(message, function(response) {
                    console.log(response);
                });
            }

        } else {
            message = {
                'type': 'login_loading',
                'readyState': status.readyState,
                'response': status.response
            };
            // messageObj.innerText = status.response.message;
            yuno.background.sendMessage(message, function(response) {
                console.log(response);
            });
        }
    },
    saveTempCall: function(status) {
        var message = {};
        message = {
            'type': 'saveToTemplateRes',
            'response': status.response
        };
        yuno.background.sendMessage(message, function(response) {
            console.log(response);
        });
    }
};

yuno.background.init();
