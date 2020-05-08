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
import { string, shape, objectOf, arrayOf, bool } from 'prop-types';
import styles from "./styles";
const useStyles = makeStyles(styles);
function ListEngineSelected({
    item,
    engineByCategories
}) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(true);
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
    function handleExpandClick() {
        setExpanded(!expanded);
    };
    return (
        <Fragment>
            <Typography component="p" className={classes.titleCategorySelected}>
                {item.categoryName}
            </Typography>
            {
                item.engineIds.map(engine => {
                    const engineFilter = engineByCategories[item.categoryId].find(item => item.id === engine);
                    return (
                        <Card key={engine} className={classes.cardEngines}>
                            <CardHeader
                                avatar={
                                    engineFilter.logoPath || engineFilter.deploymentModel === 'FullyNetworkIsolated' ?
                                        renderLogoEngine(engineFilter.logoPath, engineFilter.deploymentModel === 'FullyNetworkIsolated', 'selected') :
                                        null
                                }
                                action={
                                    <Fragment>
                                        <IconButton className={expanded ? classes.expandOpen : ''} onClick={handleExpandClick}>
                                            <ExpandMore />
                                        </IconButton>
                                        <IconButton data-id={engineFilter.id}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Fragment>
                                }
                                title={
                                    !engineFilter.logoPath && (
                                        <Typography component="p" className={classes.titleHeaderEngines}>
                                            {engineFilter.name}
                                        </Typography>
                                    )
                                }
                                className={classes.cardHeaderEngines}
                            />
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <CardContent className={classes.cardContentEngines}>
                                    <Typography component="p" color="textSecondary">
                                        {engineFilter.description}
                                    </Typography>

                                    <Typography component="p" >
                                        {`Price: $${engineFilter.price / 100}/hour`}
                                    </Typography>
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