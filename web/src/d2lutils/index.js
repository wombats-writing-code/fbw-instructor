import _ from 'lodash'
import axios from 'axios'
import Q from 'q'
import D2L from 'valence'

import { getDomain, SCHOOL_TO_BANK } from '../reducers/common'

export function getAuthenticationUrl (credentials) {
  let AppContext = new D2L.ApplicationContext(credentials.appID, credentials.appKey);
  let authenticationUrl = AppContext.createUrlForAuthentication(credentials.host,
    credentials.port,
    credentials.callbackUrl)

  return authenticationUrl
}

export function whoami (credentials, url) {
  let AppContext = new D2L.ApplicationContext(credentials.appID, credentials.appKey);
  let userContext = AppContext.createUserContext(credentials.host,
    credentials.port,
    url)
  let whoamiUrl = '/d2l/api/lp/1.5/users/whoami'
  let options = {
    url: userContext.createAuthenticatedUrl(whoamiUrl, 'GET')
  }

  return axios(options)
  .then((response) => {
    return Q.when(response.data)
  })
  .catch((error) => {
    console.log('error getting whoami', error)
  })
}

export function instructorCourses (credentials, url) {
  // need to get all of these, because paginated
  let AppContext = new D2L.ApplicationContext(credentials.appID, credentials.appKey);
  let userContext = AppContext.createUserContext(credentials.host,
    credentials.port,
    url)
  let enrollmentsUrl = '/d2l/api/lp/1.14/enrollments/myenrollments/'
  // 3 = Course Offering, I think
  // Do we need some sort of startDateTime / endDateTime filter???
  //   http://docs.valence.desire2learn.com/res/enroll.html
  let urlWithFilters = `${enrollmentsUrl}?isActive=true&canAccess=true&orgUnitTypeId=3`
  let options = {
    url: userContext.createAuthenticatedUrl(urlWithFilters, 'GET')
  }

  let instructorCourseBanks = []
  // console.log(options)
  return axios(options)
  .then((response) => {
    let enrollments = response.data.Items
    enrollments = _.filter(enrollments, function (enrollment) {
      return enrollment.OrgUnit.Type.Code == 'Course Offering' &&
        enrollment.Access.IsActive &&
        enrollment.Access.CanAccess;
    });

    // instructors can get course terms
    let offeringPromises = []
    _.each(enrollments, (course) => {
      instructorCourseBanks.push({
        id: course.OrgUnit.Id,
        name: course.OrgUnit.Name.trim()
      })
      let url = `/d2l/api/lp/1.5/courses/${course.OrgUnit.Id}`
      let options = {
        url: userContext.createAuthenticatedUrl(url, 'GET')
      }
      offeringPromises.push(axios(options))
    })
    return axios.all(offeringPromises)
  })
  .then((offerings) => {
    // we also need to replace the D2L ID here with the QBank ID
    // And create the QBank banks / aliases?
    let bankTestPromises = []
    _.each(offerings, (offering, index) => {
      instructorCourseBanks[index].term = offering.data.Semester.Name.trim()
      instructorCourseBanks[index].department = offering.data.Department.Name.trim()
      instructorCourseBanks[index].displayName = `${instructorCourseBanks[index].name} -- ${offering.data.Semester.Name.trim()}`

      let options = {
        url: `${getDomain()}/middleman/banks/${bankAliasId(instructorCourseBanks[index].id)}`,
        validateStatus: (status) => {return true}  // let's filter the non-existent ones out later
      }
      bankTestPromises.push(axios(options))
    })
    return axios.all(bankTestPromises)
  })
  .then((bankResponses) => {
    // Let's see if the banks exist. For the ones that do not,
    // create them and set alias.
    let createBankPromises = []
    _.each(bankResponses, (response, index) => {
      let offering = instructorCourseBanks[index]
      if (response.status !== 200) {
        // create the bank
        let options = {
          url: `${getDomain()}/middleman/banks`,
          method: 'post',
          data: {
            bankId: SCHOOL_TO_BANK['acc'],
            departmentName: offering.department,
            subjectName: offering.name,
            termName: offering.term,
            aliasId: bankAliasId(offering.id)
          }
        }
        createBankPromises.push(axios(options))
      } else {
        createBankPromises.push(Q.when(response))
      }
    })
    return axios.all(createBankPromises)
  })
  .then((newBanks) => {
    // replace the bankIds
    // console.log('newBanks', newBanks)
    _.each(newBanks, (bank, index) => {
      // console.log('bank', bank)
      instructorCourseBanks[index].id = bank.data.id
    })
    return Q.when(instructorCourseBanks)
  })
  .catch((error) => {
    console.log('error getting d2l enrollments', error)
  })
  // let bookmark = ''
  // let enrollments = []
  // let hasMoreItems = true

  // not sure how to handle paging with promises, so for now assume that using
  // filters successfully limits results to one page
  // function getNextPage () {
  //   let bookmarkUrl = `${enrollmentsUrl}?isActive=true&canAccess=true`
  //   let nextPageOptions = {
  //     url: userContext.createAuthenticatedUrl(bookmarkUrl, 'GET')
  //   }
  //   return axios(nextPageOptions)
  //   .then((data) => {
  //     console.log(data)
  //     hasMoreItems = typeof data.PagingInfo.HasMoreItems !== 'undefined' ? data.PagingInfo.HasMoreItems : false;
  //     bookmark = typeof data.PagingInfo.Bookmark !== 'undefined' ? data.PagingInfo.Bookmark : '';
  //     enrollments = enrollments.concat(data.Items);
  //     if (!hasMoreItems) {
  //       enrollments = _.filter(enrollments, function (enrollment) {
  //         return enrollment.OrgUnit.Type.Code == 'Course Offering' &&
  //           enrollment.Access.IsActive &&
  //           enrollment.Access.CanAccess;
  //       });
  //
  //       // students cannot view terms
  //       var d2lCourses = [];
  //       _.each(enrollments, function (subject) {
  //         d2lCourses.push({
  //           id: subject.OrgUnit.Id,
  //           name: subject.OrgUnit.Name.trim()
  //         });
  //       });
  //       // for students, this looks like (JSON stringified):
  //       // "[{"id":1583886,"name":"Fly-by-Wire FBW1"}]"
  //       return Q.when(d2lCourses);
  //     } else {
  //       return getNextPage();
  //     }
  //   })
  // }
  //
  // getNextPage();
}

export function stringifyUsername (whoami) {
  return `${whoami.FirstName}-${whoami.LastName}-${whoami.Identifier}`
}

export function extractDisplayName (username) {
  if (username.indexOf('-') >= 0) {
    return `${username.split('-')[0]} ${username.split('-')[1]}`
  } else {
    return username
  }
}

export function bankAliasId (courseId) {
  return `assessment.Bank%3A${courseId}%40ACC.D2L.COM`
}
