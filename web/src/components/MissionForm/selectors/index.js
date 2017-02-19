import { createSelector } from 'reselect'
import _ from 'lodash'
import {matches} from 'fbw-platform-common/utilities'


const getModules = (state) => state.mapping ? state.mapping.modules : null
export const getOutcomes = (state) => state.mapping ? state.mapping.outcomes : null
const getRelationships = (state) => state.mapping ? state.mapping.relationships : null
const getItems = (state) => state.course ? state.course.items : null
const getSelectedDirectives = (state) => state.editMission && state.editMission.newMission ? state.editMission.newMission.selectedDirectives : null
const getAddMissionForm = state => state.editMission.newMission


export const itemsForDirectivesSelector = createSelector([getOutcomes, getItems], (outcomes, allItems) => {
  //console.log('allItems', allItems, 'selectedDirectives', selectedDirectives);
  let outcomeIds = _.map(outcomes, 'id');

  let numberItemsForDirectives = _.reduce(allItems, (result, item) => {
      result[item.outcome] = (result[item.outcome] || 0) + 1;

    return result;
  }, {});

  // currently this is the full count of all items for a given LO
  return numberItemsForDirectives;
})


export const displayedDirectivesSelector = createSelector([
  getAddMissionForm, getOutcomes, getModules, getRelationships
],
  (addMissionForm, outcomes, modules, relationships) => {
    if (!addMissionForm) return null;

    let selectedModule = addMissionForm.selectedModule;
    let displayedDirectives;
    if (selectedModule) {
      displayedDirectives = _.filter(outcomes, outcome => {
        let module = getOutcomeModule(outcome, modules, relationships);
        return (module === addMissionForm.selectedModule)
      });
    } else {
      displayedDirectives = outcomes;
    }

    if (addMissionForm.directiveSearchQuery) {
      displayedDirectives = _.filter(displayedDirectives, o => matches(addMissionForm.directiveSearchQuery, o.displayName));
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
