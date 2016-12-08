import _ from 'lodash'

import { BANK_TO_DOMAIN, DOMAIN_TO_LIBRARY, BANK_TO_LIBRARY } from './common'

export function findBankDomain (bankId, enrolledBanks) {
  // handles both simple login (hardcoded bankIds) and D2L-linked banks
  if (_.keys(BANK_TO_DOMAIN).indexOf(bankId) >= 0) {
    return BANK_TO_DOMAIN[bankId]
  } else {
    console.log('bankId', bankId, 'enrolledBanks', enrolledBanks)
    let department = _.find(enrolledBanks, {id: bankId}).department.toLowerCase()
    console.log('department', department)
    switch (department) {
      case 'accounting':
      case 'acc':
        return 'accounting'

      case 'algebra':
      case 'alg':
      case 'mat':
        return 'algebra'

      default:
        return 'accounting'
    }
  }
}

export function findBankLibrary (bankId, enrolledBanks) {
  let department = findBankDomain(bankId, enrolledBanks)
  return DOMAIN_TO_LIBRARY[department]
}
