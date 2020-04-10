import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import GraphicEq from "@material-ui/icons/GraphicEq";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import styles from "./styles";
const useStyles = makeStyles({
  root: {
    minWidth: 275,
    height: 250
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  ...styles
});
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250
    }
  }
};

export default function ListEngine({
    title,
    des,
    libraries
}) {
  const classes = useStyles();
  const [personName, setPersonName] = React.useState([]);
  const handleChange = event => {
    setPersonName(event.target.value);
  };
  return (
    <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
        <GraphicEq className={classes.icon} />
        <Typography component="p" className={classes.cardTitle}>
            {title}
        </Typography>
        <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
        >
            {des}
        </Typography>
        <FormControl className={classes.formControl}>
            <InputLabel className={classes.labelInput}>
            Choose Libraries
            </InputLabel>
            <Select
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            multiple
            value={personName}
            onChange={handleChange}
            input={<Input />}
            renderValue={selected => selected.join(", ")}
            MenuProps={MenuProps}
            className={classes.selectLibraries}
            >
            {libraries.map(name => (
                <MenuItem key={name} value={name}>
                <Checkbox checked={personName.indexOf(name) > -1} />
                <ListItemText primary={name} />
                </MenuItem>
            ))}
            </Select>
        </FormControl>
        </CardContent>
    </Card>
  );
}
