// AssessmentItem store

var AssessmentItemDispatcher = require('../dispatchers/AssessmentItem');
var AssessmentItemConstants = require('../constants/AssessmentItem');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var credentials = require('../constants/credentials');
var qbankFetch = require('fbw-utils')(credentials).qbankFetch;

var ActionTypes = AssessmentItemConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var UserStore = require('./User');

var _items = [];

var AssessmentItemStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT, _items);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getItem: function (id) {
    return _.find(_items, function (item) {
      return item.id == id;
    });
  },
  getItems: function (assessmentId) {
    var _this = this;
    UserStore.getBankId()
      .then((bankId) => {
        var params = {
          path: `assessment/banks/${bankId}/assessments/${assessmentId}/items?page=all&sections`
        };
        return qbankFetch(params);
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        _items = data.data.results;
        _this.emitChange();
      })
      .catch((error) => {
        console.log('error in getting assessment items');
      })
      .done();
  },
  setItems: function (data) {
    var _this = this;
    UserStore.getBankId()
      .then((bankId) => {
        var originalItems = data['items'],
          params = {
            data: data,
            method: 'PUT',
            path: `assessment/banks/${bankId}/assessments/${data.assessmentId}/items`
          };

        params.data.itemIds = _.map(originalItems, 'id');
        _items = originalItems;
        this.emitChange();

        return qbankFetch(params);
      })
      .then((res) => {
        return res.json();
      })
      .then((responseData) => {
        _this.getItems(data.assessmentId);
      })
      .catch((error) => {
        console.log('error in setting items');
      })
      .done();
  }
});

AssessmentItemStore.dispatchToken = AssessmentItemDispatcher.register(function (action) {
  switch(action.type) {
    case ActionTypes.SET_ITEMS:
      AssessmentItemStore.setItems(action.content);
      break;
    case ActionTypes.UPDATE_ASSESSMENT:
      AssessmentItemStore.updateAssessment(action.content);
      break;
    case ActionTypes.DELETE_ASSESSMENT:
      AssessmentItemStore.deleteAssessment(action.content);
      break;
  }
});

module.exports = AssessmentItemStore;
