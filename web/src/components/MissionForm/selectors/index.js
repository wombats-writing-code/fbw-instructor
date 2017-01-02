import { createSelector } from 'reselect'
import _ from 'lodash'
import {matches} from 'fbw-platform-common/utilities'


const getModules = (state) => state.mapping ? state.mapping.modules : null
export const getOutcomes = (state) => state.mapping ? state.mapping.outcomes : null
const getRelationships = (state) => state.mapping ? state.mapping.relationships : null
const getItems = (state) => state.bank ? state.bank.items : null
const getSelectedDirectives = (state) => state.editMission && state.editMission.newMission ? state.editMission.newMission.selectedDirectives : null
const getAddMissionForm = state => state.editMission.newMission

export const moduleTreeSelector = createSelector(
  [getModules, getOutcomes, getRelationships],
  (modules, outcomes, relationships) => {
  let tree = {
    isRoot: true,
    children: []
  };

  if (!(modules && outcomes && relationships)) return tree;


  for (var i=0; i<modules.length; i++) {
    let module = modules[i];
    let newModule = {
      id: module.id,
      description: module.description.text,
      displayName: module.displayName.text,
      objectiveBankId: module.objectiveBankId,
      children: _.filter(outcomes, (outcome) => {
        // let rels = _.filter(relationships, {sourceId: outcome.id, destinationId: module.id});
        let rels = _.filter(relationships, {sourceId: module.id, destinationId: outcome.id});

        // if (rels.length > 0) {
        //   console.log(outcome.displayName.text, 'has parent', module.displayName.text);
        // }

        return rels.length > 0;
      })
    };

    tree.children.push(newModule)
  }

  return tree;
});


export const itemsForDirectivesSelector = createSelector([getOutcomes, getItems], (outcomes, allItems) => {
  //console.log('allItems', allItems, 'selectedDirectives', selectedDirectives);
  let outcomeIds = _.map(outcomes, 'id');

  let numberItemsForDirectives = _.reduce(allItems, (result, item) => {
      result[item.learningObjectiveIds[0]] = (result[item.learningObjectiveIds[0]] || 0) + 1;

    return result;
  }, {});

  // currently this is the full count of all items for a given LO
  return numberItemsForDirectives;
})


export const displayedDirectivesSelector = createSelector([getAddMissionForm, getOutcomes],
  (addMissionForm, outcomes) => {
    if (!addMissionForm) return null;

    let selectedModule = addMissionForm.selectedModule;
    let displayedDirectives;
    if (selectedModule) {
      displayedDirectives = addMissionForm.selectedModule.children;
    } else {
      displayedDirectives = outcomes;
    }

    if (addMissionForm.directiveSearchQuery) {
      displayedDirectives = _.filter(displayedDirectives, o => matches(addMissionForm.directiveSearchQuery, o.displayName.text));
    }

    return displayedDirectives;
})
