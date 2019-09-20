import DateFormat from './DateFormat';
import EnableTimeOption from './EnableTimeOption';
import ListItems from './ListItems';
import createTextInput from './createTextInput';
import Required from './Required';


export default {
  name: createTextInput({ itemType: 'name', label: 'Field Name' }),
  label: createTextInput({ itemType: 'label', label: 'Field Label' }),
  instruction: createTextInput({ itemType: 'instruction', label: 'Field Instruction'}),
  required: Required,
  items: ListItems,
  min: createTextInput({ itemType: 'min', label: 'Min Value', type: 'number'}),
  max: createTextInput({ itemType: 'max', label: 'Max Value', type: 'number'}),
  dateFormat: DateFormat,
  enableTimeOption: EnableTimeOption,
}
