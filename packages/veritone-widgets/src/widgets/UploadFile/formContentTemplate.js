import React from 'react';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Delete from "@material-ui/icons/Delete";
import { makeStyles } from '@material-ui/core/styles';
import { get } from 'lodash';
import styles from './styles';
const useStyles = makeStyles(styles);
export default function FormAddContentTemplate({
    contentTemplate,
    onChange,
    removeContentTemplate,
    validate
}) {
    const classes = useStyles();
    const records = get(contentTemplate, 'schemas.records', []).find(item => item.status === 'published');
    const { properties = {} } = get(records, 'definition', {});
    const { required = [] } = get(records, 'definition', {});

    return (
        <Card className={classes.cardContentTemplate}>
            <CardHeader
                action={
                    <IconButton data-id={contentTemplate.id} onClick={removeContentTemplate}>
                        <Delete />
                    </IconButton>
                }
                title={contentTemplate.name}
                className={classes.cardHeaderContentTemplate}
            />

            <CardContent className={classes.cardMainContentTemplate}>
                {
                    Object.keys(properties).map(item => {
                        return (
                            <FormControl key={item} className={classes.formContentTemplate}>
                                <TextField
                                    id={contentTemplate.id}
                                    required={required.includes(item)}
                                    name={item}
                                    label={item}
                                    onChange={onChange}
                                    error={required.includes(item) && validate && !validate.data[item].length ? true : false}
                                    helperText=""
                                />
                            </FormControl>
                        )
                    })
                }
            </CardContent>
        </Card>
    )
}