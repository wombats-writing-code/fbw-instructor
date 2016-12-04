// Authorization store

var AuthorizationDispatcher = require('../dispatchers/Authorization');
var AuthorizationConstants = require('../constants/Authorization');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var credentials = require('../constants/credentials');
var fbwUtils = require('fbw-utils')(credentials);

var ConvertDate2Dict = fbwUtils.ConvertDateToDictionary;
var qbankFetch = fbwUtils.qbankFetch;

var BaseBanks = AuthorizationConstants.BaseBanks;
var InstructorAuthorizationFunctions = AuthorizationConstants.InstructorAuthorizationFunctions;

var _data = {};

var AuthorizationStore = _.assign({}, EventEmitter.prototype, {
  hasAuthorizations: function (data, callback) {
    // data should include username and the schoolId (acc or qcc)
    var url = `assessment/banks/${credentials.qbank.SchoolNodes[data.schoolId]}/items`,
      params = {
        path: url,
        proxy: data.username
      };
      qbankFetch(params)
        .then((res) => {
          if (res.status == 200) {
            callback(true);
          } else {
            callback(false);
          }
        })
        .catch((error) => {
          callback(false);
        })
        .done();
  },
  setAuthorizations: function (data) {
    // data should include username and the schoolId (acc or qcc)
    var qualifierIds = BaseBanks,
      schoolNodeId = credentials.qbank.SchoolNodes[data.schoolId],
      now = new Date(),
      endDate = ConvertDate2Dict(now),
      params = {
      data: {
        bulk: []
      },
      method: 'POST',
      path: 'authorization/authorizations'
    };

    endDate.month = endDate.month + 6;

    if (endDate.month > 12) {
      endDate.month = endDate.month - 12;
      endDate.year++;
    }

    if (endDate.month == 2 && endDate.day > 28) {
      endDate.day = 28;
    }

    if ([4, 6, 9, 11].indexOf(endDate.month) >= 0 && endDate.day == 31) {
      endDate.day = 30;
    }

    qualifierIds = qualifierIds.concat([schoolNodeId]);
    _.each(qualifierIds, function (qualifierId) {
      _.each(InstructorAuthorizationFunctions, function (functionId) {
        params.data.bulk.push({
          agentId: data.username,
          endDate: endDate,
          functionId: functionId,
          qualifierId: qualifierId
        });
      });
    });
    console.log('setting authz');
    return qbankFetch(params);
  }
});

AuthorizationStore.dispatchToken = AuthorizationDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.SET_AUTHORIZATIONS:
            AuthorizationStore.setAuthorizations(action.content);
            break;
    }
});

module.exports = AuthorizationStore;
