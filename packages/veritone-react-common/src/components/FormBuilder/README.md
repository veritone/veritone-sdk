# Technical specs
https://steel-ventures.atlassian.net/wiki/spaces/VT/pages/1004274015/Form+builder

# Desired API
## Using Form components:
```
import { Form, generateFormState } from 'veritone-react-common';

export default function FormSample(form) {
    const [formState, setFormState] = useState(
        Object.assign({}, generateFormState(form.definition), initialState)
    )
    return (
        <Form
            value={formState}
            onChange={setFormState}
            errors={erros}
        />
    )
}
```

## Form type configuration:
```
{
    textInput: ['name', 'label', 'instruction', 'maxLength', 'required'],
    rating: ['name', 'label', 'instruction', 'maxValue', 'required'],
    dateTime: ['name', 'label', 'instruction', 'format', 'timeOptions', 'required']
    ...
}

# textInput, rating, dateTime: form block name
# name, label: form block configuration
# Each form block configuration is matching with a minimal component, take name for example:
<TextField
    label="name"
    value={props.value}
    onChange={(e) => props.onChange({ name: "name", value: e.target.value})}
/>
# Each form block is set of form block configuration
# A form is set of form blocks:
sampleForm = {
    definition: [
        {
            type: 'textInput',
            name: 'firstName',
            label: 'First Name',
            instruction: 'Enter your first name',
            required: true
        },
        {
            type: 'textInput',
            name: 'lastName',
            label: 'Last Name',
            instruction: 'Enter your last name',
            required: true
        },
        {
            type: 'select',
            name: 'gender',
            label: 'Your gender',
            instruction: 'Select your gender',
            required: true
        },
        ...
    ],
    isTemplate: true,
    name: 'Registration form'
}
```
