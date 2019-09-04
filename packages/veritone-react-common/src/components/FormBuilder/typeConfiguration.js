export default {
  textInput: ['name', 'label', 'instruction', 'required'],
  paragraph: ['name', 'label', 'instruction', 'required'],
  radio: ['name', 'label', 'items', 'instruction', 'required'],
  checkBox: ['name', 'label', 'items', 'instruction', 'required'],
  dateTime: ['name', 'label', 'dateFormat', 'instruction', 'required', 'enableTimeOption'],
  rating: ['name', 'label', 'min', 'max', 'instruction', 'required'],
  select: ['name', 'label', 'items', 'instruction', 'required'],
  switch: ['name', 'label', 'instruction', 'required'],
};

export const initData = {
  name: '',
  label: '',
  instruction: '',
  required: false,
  items: [{ value: 'option 1', id: (new Date()).getTime() }],
  dateFormat: 'dd-MM-yyyy',
  enableTimeOption: true,
  min: 0,
  max: 5,
}
