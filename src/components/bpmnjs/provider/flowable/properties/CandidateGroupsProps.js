import { h } from '@bpmn-io/properties-panel/preact';
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is } from 'bpmn-js/lib/util/ModelUtil';

export function CandidateGroupsProps(props) {
  const { element } = props;
  if (!is(element, 'bpmn:Task')) {
    return [];
  }

  return [
    {
      id: 'candidateGroups',
      component: CandidateGroups,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}

export function CandidateGroups(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.candidateGroups || '';
  };

  const setValue = (value) => {
    return modeling.updateProperties(element, {
      candidateGroups: value,
    });
  };

  return h(TextFieldEntry, { id, element, label: translate('Candidate Groups'), getValue, setValue, debounce });
  // return <TextFieldEntry id={id} element={element} label={translate('Candidate Groups')} getValue={getValue} setValue={setValue} debounce={debounce} />;
}
