/*jshint -W030 */

/**
 * @fileoverview Menu content handling with various validations.
 *
 */

'use strict';
var yuno = yuno || {};


/**
 * Handler to control the menu items.
 * @return {Object} Public data accessed by application.
 */
yuno.Menu = function() {

  /*
   * List of contexts where the menu should appear
   * All possible contexts : ['all', 'page', 'frame', 'selection', 'link',
   * 'editable', 'image', 'video', 'audio', 'launcher', 'browser_action',
   * 'page_action']
   */
  var contexts = ['page', 'selection'];
  //var contexts = ['page', 'selection', 'link', 'editable', 'image', 'video', 'audio'];


  /*
   * Creates new chrome context menu item.
   * @return {Object} Chrome menu item creted.
   */
  var createContextMenuItem = function(config) {
    config.contexts = contexts;
    //    config.parentId = getParent();
    chrome.contextMenus.create(config);
  };

  /*
   * Define the parent for context menu
   * @return {Object} Chrome menu item creted.
   */
  // var getParent = function() {

  //   // Not using createContextMenuItem to avoid recursion
  //   return (yuno.Menu.parent = yuno.Menu.parent || chrome.contextMenus.create({
  //     'title': 'Yuno',
  //     'contexts' : contexts
  //   }));
  // };

  /* A function creator for callbacks */
  function doStuffWithDOM(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
    console.log(domContent);
  }

  /*
   * Genric event onclick function for just a sample POC.
   */
  var genericOnClick = function(info, tab) {
    //alert('Saving selected text...: ' + info.selectionText);
    console.log('item ' + info.menuItemId + ' was clicked');
    console.log('info: ' + JSON.stringify(info));
    console.log('tab: ' + JSON.stringify(tab));


  };

  var downloadOnCliclk = function(info, tab) {

    chrome.tabs.sendMessage(tab.id, {
        type: 'download'
      },
      doStuffWithDOM);
    //alert('message sent to content script');

  };

  var chartsOnCliclk = function(info, tab) {

    chrome.tabs.sendMessage(tab.id, {
        type: 'exportChart1'
      },
      doStuffWithDOM);
    //alert('message sent to content script');

  };

  var signinOnClick = function(info, tab) {
    // Create new tab if past end of list and none open
    // chrome.tabs.create(
    //   chrome.extension.getURL('options.html')
    // );
    var loginEle = document.getElementById('login');
    /* ...if it matches, send a message specifying a callback too */
    chrome.tabs.sendMessage(tab.id, {
        type: 'login',
        html: loginEle.innerHTML
      },
      doStuffWithDOM);
    //alert('message sent to content script');

  };

  var saveToTemplate = function(info, tab) {
    var saveToTemplate = document.getElementById('saveToTemplate');
    var selText = info.selectedText;

    chrome.tabs.sendMessage(tab.id, {
        type: 'saveToTemplate',
        html: saveToTemplate.innerHTML,
        selText : selText
      },
      doStuffWithDOM);
  };


  var logoutOnClick = function() { //info, tab

    chrome.storage.local.set({
      'isAuthenticated': false
    }, function() {
      yuno.RESTManager.isAuthenticated = false;
      yuno.singletonMenus = yuno.Menu();
      yuno.singletonMenus.createMenuItems();
    });


  };


  var isAuthenticated = function() {
    // TODO(uday): implement the rest api to check authentication and session.
    return yuno.RESTManager().checkSession();
  };

  /*
   * Constructor class to create Context menu items.
   * @constructor
   */
  var MenuItems = function() {

    this.authorizedItems = [{
      'title': 'Save selection to Template',
      'onclick': saveToTemplate
    }, {
      'title': 'Download selection to Document',
      'onclick': downloadOnCliclk
    }, {
      'title': 'Export to chart',
      'onclick': chartsOnCliclk
    }, {
      'title': 'Logout',
      'onclick': logoutOnClick
    }];

    this.unAuthorisedItems = [{
      'title': 'Signin to capture',
      'onclick': signinOnClick
    }];

  };

  MenuItems.prototype.createMenuItems = function() {
    chrome.contextMenus.removeAll();

    if (isAuthenticated()) {
      _loadMenuItems(this.authorizedItems);
    } else {
      _loadMenuItems(this.unAuthorisedItems);
    }

  };

  var _loadMenuItems = function(items) {
    var itemObjs = [];

    for (var idx in items) {
      var item = items[idx];
      itemObjs[idx] = createContextMenuItem(item);
    }

    return itemObjs;
  };

  return (new MenuItems());
};

/*
 * Store the Parent of context menu globally.
 */
yuno.Menu.parent;

/**
 * Singleton objeccts to maintaing context menu object.
 */
yuno.singletonMenus = yuno.singletonMenus || yuno.Menu();
