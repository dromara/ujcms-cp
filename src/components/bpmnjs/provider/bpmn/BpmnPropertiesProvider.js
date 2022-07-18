import { Group } from '@bpmn-io/properties-panel';
import { ExecutableProps, IdProps, NameProps, ProcessProps, DocumentationProps } from './properties';

function GeneralGroup(element, translate) {
  const entries = [...NameProps({ element }), ...IdProps({ element }), ...ProcessProps({ element }), ...ExecutableProps({ element })];
  return {
    id: 'general',
    label: translate('General'),
    entries,
    component: Group,
  };
}

function DocumentationGroup(element, translate) {
  const entries = [...DocumentationProps({ element })];
  return {
    id: 'documentation',
    label: translate('Documentation'),
    entries,
    component: Group,
  };
}

function getGroups(element, translate) {
  const groups = [GeneralGroup(element, translate), DocumentationGroup(element, translate)];
  // contract: if a group returns null, it should not be displayed at all
  return groups.filter((group) => group !== null);
}

/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function BpmnPropertiesProvider(propertiesPanel, translate) {
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
      // Add the "magic" group
      // if(is(element, 'bpmn:StartEvent')) {
      //   groups.push(createMagicGroup(element, translate));
      // }
      groups = groups.concat(getGroups(element, translate));
      return groups;
    };
  };
  // registration ////////

  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after
  // the basic BPMN properties.
  propertiesPanel.registerProvider(this);
}

BpmnPropertiesProvider.$inject = ['propertiesPanel', 'translate'];
