'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
  console.log('previousVersion', details.previousVersion);
});

console.log('creating the context menu.123.');
var yuno = yuno || {};
var items = yuno.singletonMenus.createMenuItems();

for (var id in items) {
  console.log(items[id].title + ' : ' + items[id]);
}
