import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Security from "@material-ui/icons/Security";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

import { string, shape, objectOf, arrayOf, bool, isEmpty } from 'prop-types';
import styles from "./styles";
const useStyles = makeStyles(styles);
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250
      }
    }
  };
function ListEngineSelected({
    item,
    engineByCategories,
    librariesByCategories,
    handleRemoveEngine,
    handleChangeLibrariesEngineSelected,
    handleChangeFieldsEngine
}) {
    const classes = useStyles();
    const engineIds = item.engineIds && item.engineIds.length && item.engineIds.reduce((res, { id }) => ([...res,
        id]), []);
    const [expanded, setExpanded] = React.useState(engineIds);
    const renderLogoEngine = (src, showSecurity, type) => {
        return (
            <div className={type === 'header' ? classes.iconHeaderEngines : type === 'content' ? classes.iconContentEngines : classes.iconHeaderSelectedEngines}>
                {
                    showSecurity && (
                        <Security />
                    )
                }
                {
                    src && (
                        <img
                            src={src}
                            width="100"
                            height="50"
                        />
                    )
                }
            </div>
        )
    }
    function handleExpandClick(event){
        const engineId = event.currentTarget.getAttribute('data-id');
        if(expanded.includes(engineId)){
            setExpanded(expanded.filter(item => item !== engineId))
        }else{
            setExpanded([...expanded, engineId])
        }
      };
      console.log('librariesByCategories[item.categoryId]', librariesByCategories[item.categoryId])
    return (
        <Fragment key={item.categoryId}>
            <Typography component="p" className={classes.titleCategorySelected}>
                {item.categoryName}
            </Typography>
            {
                item.engineIds.map(engine => {
                    const librariesSelected = engine.librariesSelected || [];
                    return (
                        <Card key={engine} className={classes.cardEngines}>
                            <CardHeader
                                avatar={
                                    engine.logoPath || engine.deploymentModel === 'FullyNetworkIsolated' ?
                                        renderLogoEngine(engine.logoPath, engine.deploymentModel === 'FullyNetworkIsolated', 'selected') :
                                        null
                                }
                                action={
                                    <Fragment>
                                        <IconButton className={expanded.includes(engine.id) ? classes.expandOpen : ''} data-id={engine.id} onClick={handleExpandClick}>
                                            <ExpandMore />
                                        </IconButton>
                                        <IconButton data-id={engine.id} onClick={handleRemoveEngine}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Fragment>
                                }
                                title={
                                    !engine.logoPath && (
                                        <Typography component="p" className={classes.titleHeaderEngines}>
                                            {engine.name}
                                        </Typography>
                                    )
                                }
                                className={classes.cardHeaderEngines}
                            />
                            <Collapse in={expanded.includes(engine.id)} timeout="auto" unmountOnExit>
                                <CardContent className={classes.cardContentEngines}>
                                    <Typography component="p" color="textSecondary">
                                        {engine.description}
                                    </Typography>

                                    <Typography component="p" >
                                        {`Price: $${engine.price / 100}/hour`}
                                    </Typography>

                                    {
                                        engine.libraryRequired &&  (
                                            <div>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel className={classes.labelInput}>
                                                        Choose Libraries
                                                              </InputLabel>
                                                    <Select
                                                        multiple
                                                        value={librariesSelected}
                                                        onChange={(event)=>{
                                                            handleChangeLibrariesEngineSelected(event, engine.id)
                                                        }}
                                                        input={<Input />}
                                                        renderValue={selected => selected.join(", ")}
                                                        MenuProps={MenuProps}
                                                        className={classes.selectLibraries}
                                                    >
                                                        {Object.values(librariesByCategories[item.categoryId]).map(item => (
                                                            <MenuItem key={item.name} value={item.name}>
                                                                <Checkbox checked={librariesSelected.indexOf(item.name) > -1} />
                                                                <ListItemText primary={item.name} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        )
                                    }
                                    <from className={classes.formfieldsEngine}>
                                        {

                                            engine.fields.length && (
                                                engine.fields.map(item => {
                                                    return (
                                                        <Fragment key={engine.id} >
                                                            {
                                                                ["MultiPicklist", "Picklist"].includes(item.type) ? (
                                                                    <TextField
                                                                        id={engine.id}
                                                                        name={`${item.name}`}
                                                                        select
                                                                        label={item.label || item.name}
                                                                        value={item.defaultValue}
                                                                        onChange={handleChangeFieldsEngine}
                                                                    >
                                                                        {
                                                                            item.options.map(item => {
                                                                                return (
                                                                                    <MenuItem key={item.value} value={item.value}>{item.key}</MenuItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </TextField>
                                                                ) : (

                                                                        <TextField
                                                                            id={engine.id}
                                                                            name={`${item.name}`}
                                                                            label={item.label || item.name}
                                                                            defaultValue={item.defaultValue}
                                                                            onChange={handleChangeFieldsEngine}
                                                                        />

                                                                    )
                                                            }
                                                        </Fragment>

                                                    )
                                                })

                                            )

                                        }
                                    </from>

                                </CardContent>
                            </Collapse>
                        </Card>
                    )
                })
            }

        </Fragment>
    );
}
ListEngineSelected.propTypes = {
    item: shape({
        categoryId: string,
        categoryName: string
    }),
    engineByCategories: objectOf(
        arrayOf(
            shape({
                id: string,
                name: string,
                description: string,
                category: shape({
                    id: string,
                    name: string
                }),
                isPublic: bool,
                price: string
            })
        )
    ),
}
export default ListEngineSelected;