import { createSelector } from 'reselect'
import _ from 'lodash'
import {matches} from 'fbw-platform-common/utilities'


const getModules = (state) => state.mapping ? state.mapping.modules : null
export const getOutcomes = (state) => state.mapping ? state.mapping.outcomes : null
const getRelationships = (state) => state.mapping ? state.mapping.relationships : null
const getItems = (state) => state.course ? state.course.items : null
const getSelectedDirectives = (state) => state.editMission && state.editMission.newMission ? state.editMission.newMission.selectedDirectives : null


export const itemsForDirectivesSelector = createSelector([getOutcomes, getItems], (outcomes, allItems) => {
  //console.log('allItems', allItems, 'selectedDirectives', selectedDirectives);
  let outcomeIds = _.map(outcomes, 'id');

  let itemsForDirectives = _.reduce(allItems, (result, item) => {
      result[item.outcome] = result[item.outcome] || [];
      result[item.outcome].push(item);

    return result;
  }, {});

  // currently this is the full count of all items for a given LO
  return itemsForDirectives;
})


export const displayedDirectivesSelector = createSelector([
  state => state.editMission,
  state => state.editMission.outcomeQuery,
  getOutcomes, getModules, getRelationships, itemsForDirectivesSelector
],
  (editMission, outcomeQuery, outcomes, modules, relationships, itemsForDirectives) => {
    if (!editMission) return null;

    // only show outcomes that have at least 6 questions
    let subsetOutcomes = _.filter(outcomes, outcome => {
      return itemsForDirectives[outcome.id] && itemsForDirectives[outcome.id].length >= 6;
    })

    let selectedModule = editMission.selectedModule;
    let displayedDirectives = subsetOutcomes;
    if (selectedModule) {
      displayedDirectives = _.filter(subsetOutcomes, outcome => {
        let module = getOutcomeModule(outcome, modules, relationships);
        return (module === editMission.selectedModule)
      });
    }

    if (outcomeQuery) {
      displayedDirectives = _.filter(displayedDirectives, o => matches(outcomeQuery, o.displayName));
    }

    return displayedDirectives;
})

export const getOutcomeModule = function(outcome, modules, relationships) {
  if (!outcome) {
    throw TypeError('Outcome must be provided in 1st arg')
  }
  if (!modules) {
    throw TypeError('modules must be provided in 2nd arg')
  }
  if (!relationships) {
    throw TypeError('relationships must be provided in 3rd arg')
  }

  let rel = _.find(relationships, {type: 'HAS_PARENT_OF', sourceId: outcome.id});

  // console.log('rel', rel);

  if (!rel) return null;

  return _.find(modules, {id: rel.targetId});
}

export const isRootOutcome = function(outcome, outcomes, modules, relationships) {
  if (!outcome) {
    throw TypeError('Outcome must be provided in 1st arg')
  }
  if (!modules) {
    throw TypeError('modules must be provided in 2nd arg')
  }
  if (!relationships) {
    throw TypeError('relationships must be provided in 3rd arg')
  }

  // find all the outcomes that have this outcome as a prerequisite
  let rels = _.filter(relationships, {type: 'HAS_PREREQUISITE_OF', targetId: outcome.id});
  // let rels = _.filter(relationships, {type: 'HAS_PREREQUISITE_OF', sourceId: outcome.id});

  // console.log(outcome.displayName, 'leads to ', rels.length, 'outcomes')

  // if no outcomes, this is a root outcome
  if (rels.length === 0) return true;

  let thisModule = getOutcomeModule(outcome, modules, relationships);
  let withinSameModule = _.filter(rels, rel => {
    let otherOutcome = _.find(outcomes, {id: rel.sourceId});
    let module = getOutcomeModule(otherOutcome, modules, relationships);
    if (!module) {
      // console.log('can\'t find module of ', otherOutcome.displayName, otherOutcome)
      return;
    }
    // console.log(outcome.displayName, 'leads to', otherOutcome.displayName, 'in', module.displayName)
    return module === thisModule;
  });


  return withinSameModule.length === 0;
}
