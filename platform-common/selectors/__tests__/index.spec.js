
let chai = require('chai');
let path = require('path')
chai.should();

import {
  isTarget, targetKey, targetStatus, filterItemsByTarget, directiveIdsFromQuestions, localDateTime
} from '../index.js'

const targetQuestion = {
  displayName: {
    text: "2"
  },
}

const notTargetQuestion = {
  displayName: {
    text: "2.2"
  },
}

const noMagicNumberQuestion = {
  displayName: {
    text: "hi there"
  }
}

const noNameQuestion = {
  displayName: {
    text: ""
  }
}

describe('is a Target', () => {
  it('should say this question is a Target', () => {
    let result = isTarget(targetQuestion);
    result.should.equal(true);
  });
})
