// sortItemsByModules.js
// take a list of modules (with children outcomes) and items, then
// return a dictionary of modules with item children
'use strict';

var _ = require('lodash');

var SortItemsByModules = function (modules, items) {
  var moduleItems = {};
  _.each(modules, function (module) {
    moduleItems[module.id] = {
      displayName: module.displayName.text,
      items: []
    };
  });

  _.each(modules, function (module) {
    var outcomeIds = _.map(module.childNodes, 'id');
    _.each(items, function (item) {
      if (outcomeIds.indexOf(item.learningObjectiveIds[0]) >= 0) {
        moduleItems[module.id]['items'].push(item);
      }
    });
  });
  return moduleItems
};

module.exports = SortItemsByModules;