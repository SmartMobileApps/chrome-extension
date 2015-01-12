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
   * All possible contexts : ['all', 'page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio', 'launcher', 'browser_action', 'page_action']
   */
  var contexts = ['page', 'selection', 'link', 'editable', 'image', 'video', 'audio'];

  /*
   * Store the Parent of context menu globally.
   */
  var parent;

  /*
   * Creates new chrome context menu item.
   * @return {Object} Chrome menu item creted.
   */
  var createContextMenuItem = function(config) {
    config.contexts = contexts;
    config.parentId = getParent();
    return chrome.contextMenus.create(config);
  };

  /*
   * Define the parent for context menu
   * @return {Object} Chrome menu item creted.
   */
  var getParent = function() {
    return (parent = parent || chrome.contextMenus.create({ // Not using createContextMenuItem to avoid recursion
      'title': 'Yuno',
      'contexts' : contexts
    }));
  };

  /*
   * Genric event onclick function for just a sample POC.
   */
  var genericOnClick = function(info, tab) {
    //alert('Clicked in generic function...');
    console.log('item ' + info.menuItemId + ' was clicked');
    console.log('info: ' + JSON.stringify(info));
    console.log('tab: ' + JSON.stringify(tab));
  };

  var isAuthenticated = function() {
    // TODO(uday): implement the rest api to check authentication and session.
    return false; // Mock to check signin functinality.
  };

  /*
   * Constructor class to create Context menu items.
   * @constructor
   */
  var MenuItems = function() {
   
    this.authorizedItems = [{
      'title': 'Save selection to Template',
      'onclick': genericOnClick
    }, {
      'title': 'Download selection to Document',
      'onclick': genericOnClick
    }];

    this.unAuthorisedItems = [{
      'title': 'Signin to capture',
      'onclick': genericOnClick
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

/**
 * Singleton objeccts to maintaing context menu object.
 */
yuno.singletonMenus = yuno.singletonMenus || yuno.Menu();
