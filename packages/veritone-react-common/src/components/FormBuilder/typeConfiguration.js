const typeConfiguration = {
  textInput: ['name', 'label', 'instruction', 'required'],
  paragraph: ['name', 'label', 'instruction', 'required'],
  radio: ['name', 'label', 'items', 'instruction', 'required'],
  checkBox: ['name', 'label', 'items', 'instruction', 'required'],
  dateTime: ['name', 'label', 'dateFormat', 'instruction', 'required', 'enableTimeOption'],
  rating: ['name', 'label', 'min', 'max', 'instruction', 'required'],
  select: ['name', 'label', 'items', 'instruction', 'required'],
  switch: ['name', 'label', 'instruction', 'required'],
  number: ['name', 'label', 'min', 'max', 'instruction', 'required'],
};

export const initData = {
  name: '',
  label: '',
  instruction: '',
  required: false,
  items: [{ value: 'option 1', id: (new Date()).getTime().toString() }],
  dateFormat: 'dd-MM-yyyy',
  enableTimeOption: false,
  min: 0,
  max: 5
}

export const addBlock = ({type, name}, form) => {
  return [
    ...form,
    typeConfiguration[type]
      .slice(1)
      .reduce((data, type) => ({
        ...data,
        [type]: initData[type]
      }), { type, name })
  ];
}

export const removeBlock = (index, form) => {
  return form.filter((_, formIndex) => formIndex !== index);
}


export default typeConfiguration;
