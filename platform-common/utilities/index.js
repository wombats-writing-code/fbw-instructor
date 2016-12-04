import _ from 'lodash'

import Q from 'q'

let moment = require('moment')
let config = require('../configuration')

let Lockr = require('lockr');

import { isTarget, targetKey } from '../selectors'

export const isLocal = (conf) => conf === 'dev'

export const getDomain = () => isLocal(config) ? 'http://localhost:8888' : 'https://fbw-web-backend.herokuapp.com'

export function momentToQBank (momentObject) {
  let timeUTC = momentObject.utc().toObject()

  return {
    year: timeUTC.years,
    month: timeUTC.months + 1,
    day: timeUTC.date,
    hour: timeUTC.hours,
    minute: timeUTC.minutes,
    second: timeUTC.seconds
  }
}

export function afterMidnight (timeObject) {
  return {
    year: timeObject.year,
    month: timeObject.month,
    day: timeObject.day,
    hour: 0,
    minute: 0,
    second: 1
  }
}

export function beforeMidnight (timeObject) {
  return {
    year: timeObject.year,
    month: timeObject.month,
    day: timeObject.day,
    hour: 23,
    minute: 59,
    second: 59
  }
}

export function qbankToMoment(timeObject) {
  return moment.utc({
    years: timeObject.year,
    months: timeObject.month - 1,
    days: timeObject.day,
    hours: timeObject.hour,
    minutes: timeObject.minute,
    second: timeObject.second
  })
}

export function convertPythonDateToJS (pythonTime) {
  return {
    year: pythonTime.year,
    month: pythonTime.month - 1,
    day: pythonTime.day,
    hour: pythonTime.hour,
    minute: pythonTime.minute,
    second: pythonTime.second
  }
}

export function getSchoolQBankId (school) {
  return `fbw-school%3A${school}%40FBW.MIT.EDU`
}


export function convertImagePaths (itemObject) {
  // TODO: move this into fbw-utils?
  // TODO: refactor with axios?
  // Grabs the 302 CloudFront URL from the QBank one and replaces it in the
  // question / choice / feedback text.
  var itemString = JSON.stringify(itemObject),
    mc3RegEx = /https:\/\/mc3.mit.edu\/fbw-author.*?\/url/g,
    matches = itemString.match(mc3RegEx),
    cloudFrontPromises = [],
    originalURLs = [];

  if (matches) {
    while (match = mc3RegEx.exec(itemString)) {
      let mc3URL = match[0],
        params = {
          path: mc3URL.replace('https://mc3.mit.edu/fbw-author/api/v2/', '')
        };
      originalURLs.push(mc3URL);
      cloudFrontPromises.push(qbankFetch(params));
    }
  }

  if (cloudFrontPromises.length > 0) {
    // use the error callback -- fetch will automagically redirect to the
    // CloudFront URL, and then 502 error out -- from that error response,
    // we can get the CF URL and replace that in the itemString, so
    // the WebViews render images.
    return Q.all(cloudFrontPromises)
      .then((res) => {  // each res should be status code 403 from CloudFront
        _.each(res, (cf403, index) => {
          let cfURL = cf403.url,
            mc3URL = originalURLs[index];
          itemString = itemString.replace(mc3URL, cfURL);
        });
        return Q.when(JSON.parse(itemString));
      })
      .catch((error) => {
        console.log('error getting cloudfront urls!');
      });
  } else {
    return Q.when(JSON.parse(itemString));
  }
}

export function updateAssessmentSectionsWithResponse (sections, response) {
  let submittedQuestion
  let _assessmentSections = _.map(sections, (section) => {
    if (_.find(section.questions, {id: response.questionId})) {
      let routeFinished = false;
      let updatedSection = _.assign({}, section, {
        questions: _.map(section.questions, (question, idx) => {

          // first we find the question that was just submitted (that generated this response)
          if (question.id === response.questionId) {
            submittedQuestion = question;

            return _.assign({}, question, {
              responded: true,
              isCorrect: response.isCorrect,
              response: response
            });
          }

          return question;
        })
      });

      // we already have Target questions in our list, so we ignore them and only add Waypoints
      if (response.nextQuestion && !isTarget(response.nextQuestion)) {
        updatedSection.questions.push(response.nextQuestion);
      } else if (isTarget(response.nextQuestion) && !response.showAnswer) {
        // this one route is finished
        routeFinished = true;
      } else if (!response.nextQuestion) {
        // means you hit the end of the route / last target
        routeFinished = true;
        //console.log('no next question', response);
      }

      // if there is a next question, but it's a target, we know the user has done the scaffold
      // or, it might be the last target in the directive, so we need to
      // also check for that
      if (submittedQuestion) {
        // console.log('next question is target', submittedQuestion);

        //  we find the Target question to which this question belongs
        let key = targetKey(submittedQuestion);
        let target = _.find(_.filter(updatedSection.questions, isTarget), (question) => {
          return targetKey(question) === key;
        });

        // and update the updated section to set a hasNavigated = Boolean flag on it
        // only set this flag if the route has been navigated, i.e. the last
        // question in the route has been responded to
        updatedSection.questions = _.map(updatedSection.questions, (question, index) => {
          //console.log('route finished?', routeFinished, 'response show answer', response.showAnswer)
          if (question.id === target.id && routeFinished) {
            return _.assign({}, question, {
              hasNavigated: true
            });
          }
          // console.log('key', key, 'updatedSection', updatedSection, 'target', target);

          return question;
        });
      }


      return updatedSection;
    }

    return section;
  });

  return _assessmentSections
}

export function get (key) {
  return Q.when(Lockr.get(key))
}

export function save (key, value) {
  if (isBrowser) {
    Lockr.set(key, value)
  } else {
    store.save(key, value)
  }

}

export function flush () {
  if (isBrowser) {
    Lockr.flush()
  } else {
    store.keys()
    .then((keys) => {
      _.each(keys, (key) => {
        store.delete(key)
      })
    })
  }
}

export const BANK_TO_DOMAIN = {"assessment.Bank%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU": "accounting",
                               "assessment.Bank%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU": "algebra"}

export const BANK_TO_LIBRARY = {"assessment.Bank%3A57d70ed471e482a74879349a%40bazzim.MIT.EDU": "assessment.Bank%3A57279fbce7dde086c7fe20ff%40bazzim.MIT.EDU",
                                "assessment.Bank%3A576d6d3271e4828c441d721a%40bazzim.MIT.EDU": "assessment.Bank%3A57279fb9e7dde086d01b93ef%40bazzim.MIT.EDU"}

export const LO_SCAFFOLD_MISSION_GENUS_TYPE = "assessment-part-genus-type%3Afbw-specify-lo%40ODL.MIT.EDU"
export const TEST_FLIGHT_MISSION = "assessment-genus%3Afbw-in-class-mission%40ODL.MIT.EDU"
export const PRE_FLIGHT_MISSION = "assessment-genus%3Afbw-homework-mission%40ODL.MIT.EDU"
export const PHASE_I_MISSION_RECORD_TYPE = "assessment-record-type%3Afbw-phase-i%40ODL.MIT.EDU"
export const PHASE_II_MISSION_RECORD_TYPE = "assessment-record-type%3Afbw-phase-ii%40ODL.MIT.EDU"

export const BASE_BANKS = ['assessment.Bank%3AROOT%40ODL.MIT.EDU',
  'assessment.Bank%3A000000000000000000000000%40ODL.MIT.EDU',
  'assessment.Bank%3A000000000000000000000000%40bazzim.MIT.EDU']
export const STUDENT_AUTHORIZATION_FUNCTIONS = ['assessment.AssessmentTaken%3Acreate%40ODL.MIT.EDU',
  'assessment.AssessmentTaken%3Alookup%40ODL.MIT.EDU',
  'assessment.Assessment%3Atake%40ODL.MIT.EDU',
  'assessment.Bank%3Alookup%40ODL.MIT.EDU',
  'commenting.Book%3Alookup%40ODL.MIT.EDU',
  'commenting.Comment%3Alookup%40ODL.MIT.EDU',
  'hierarchy.Hierarchy%3Alookup%40ODL.MIT.EDU',
  'logging.Log%3Alookup%40ODL.MIT.EDU',
  'repository.Asset%3Acreate%40ODL.MIT.EDU',
  'repository.Asset%3Adelete%40ODL.MIT.EDU',
  'repository.Asset%3Alookup%40ODL.MIT.EDU',
  'repository.Asset%3Asearch%40ODL.MIT.EDU',
  'repository.Repository%3Alookup%40ODL.MIT.EDU',
  'resource.Bin%3Alookup%40ODL.MIT.EDU',
  'resource.Resource%3Alookup%40ODL.MIT.EDU']
