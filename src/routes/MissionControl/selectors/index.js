import { createSelector } from 'reselect'
import 'lodash'


const getModules = (state) => state.mapping ? state.mapping.modules : null
const getOutcomes = (state) => state.mapping ? state.mapping.outcomes : null
const getRelationships = (state) => state.mapping ? state.mapping.relationships : null
const getItems = (state) => state.bank ? state.bank.items : null
const getSelectedDirectives = (state) => state.mission && state.newMission ? state.newMission.selectedDirectives : null


export const moduleTreeSelector = createSelector([getModules, getOutcomes, getRelationships], (modules, outcomes, relationships) => {
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

export const itemsForDirectivesSelector = createSelector([getSelectedDirectives, getItems], (selectedDirectives, allItems) => {

  console.log('allItems', allItems, 'selectedDirectives', selectedDirectives);

  let selectedDirectiveIds = _.map(selectedDirectives, 'outcome.id');

  let numberItemsForDirectives = _.reduce(allItems, (result, item) => {
    if (selectedDirectiveIds.indexOf(item.learningObjectiveIds[0]) > -1) {
      result[item.itemId] = (result[item.itemId] || 0) + 1;
    }

    return result;
  }, {});

  return numberItemsForDirectives;
})
