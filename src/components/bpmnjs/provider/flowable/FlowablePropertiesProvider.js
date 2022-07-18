import { is } from 'bpmn-js/lib/util/ModelUtil';
import { Group } from '@bpmn-io/properties-panel';
import { CandidateGroupsProps } from './properties';

function AssignmentGroup(element, translate) {
  const entries = [...CandidateGroupsProps({ element })];
  const group = {
    id: 'assignment',
    label: translate('Assignment'),
    entries,
    component: Group,
  };
  if (group.entries.length) {
    return group;
  }
  return null;
}

function getGroups(element, translate) {
  const groups = [AssignmentGroup(element, translate)];
  // contract: if a group returns null, it should not be displayed at all
  return groups.filter((group) => group !== null);
}

// function createGroup(element, translate) {
//   if (is(element, 'bpmn:Task')) {
//     return {
//       id: 'assignment',
//       label: translate('Assignment'),
//       entries: CandidateGroupsProps(element),
//     };
//   }
//   return null;
// }

const LOW_PRIORITY = 500;

/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function FlowablePropertiesProvider(propertiesPanel, translate) {
  // API ////////

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function (element) {
    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {
      // if (is(element, 'bpmn:Task')) {
      //   groups.push(createGroup(element, translate));
      // }
      groups = groups.concat(getGroups(element, translate));
      return groups;
    };
  };
  // registration ////////

  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after
  // the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

FlowablePropertiesProvider.$inject = ['propertiesPanel', 'translate'];
