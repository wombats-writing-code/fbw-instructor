import { createSelector } from 'reselect'
import 'lodash'


const getModules = (state) => state.mapping ? state.mapping.modules : null
const getOutcomes = (state) => state.mapping ? state.mapping.outcomes : null
const getRelationships = (state) => state.mapping ? state.mapping.relationships : null



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

})
