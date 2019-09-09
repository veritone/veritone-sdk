import DateFormat from './DateFormat';
import EnableTimeOption from './EnableTimeOption';
// import Instruction from './Instruction';
// import Label from './Label';
import ListItems from './ListItems';
// import Max from './Max';
// import Min from './Min';
// import Name from './Name';
import createTextInput from './createTextInput';
import Required from './Required';
import './styles.css';

export default {
  name: createTextInput({ itemType: "name", label: "Field Name" }),
  label: createTextInput({ itemType: "label", label: "Field Label" }),
  instruction: createTextInput({ itemType: "instruction", label: "Field Instruction"}),
  required: Required,
  items: ListItems,
  min: createTextInput({ itemType: "min", label: "Min Value"}),
  max: createTextInput({ itemType: "max", label: "Max Value"}),
  dateFormat: DateFormat,
  enableTimeOption: EnableTimeOption,
}
