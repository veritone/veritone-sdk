import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import styles from './styles';
const useStyles = makeStyles(styles);
const DialogTitle = ({ children, onClose, ...other }) => {
    const classes = useStyles()
    return (
        <MuiDialogTitle disableTypography {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};

export default function EditFileUpload({ open, title, handleClose, data }) {
    const [value, setValue] = React.useState('general');
    const classes = useStyles();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Dialog onClose={handleClose} open={open} maxWidth="md">
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {title}
            </DialogTitle>
            <DialogContent dividers className={classes.dialogEditFileContent}>
                <Paper className={classes.tabsContent}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        className={classes.tabs}
                    >
                        <Tab label="General" value="general" className={classes.tab} />
                        <Tab label="Tags" value="tags" className={classes.tab} />
                    </Tabs>
                </Paper>
                {
                    value === 'general' && (
                        <div className={classes.generalContent}>
                            <p className={classes.generalInfo}>General Info</p>
                            <span className={classes.generalText}>Add information to help describe and identify your media </span>
                            <Grid container spacing={3}>
                                <Grid item xs={4}>
                                    <p className={classes.generalText}>Avatar Image (Optional)</p>
                                    <div className={classes.uploadImage} >
                                        <div className={classes.uploadImageContent}>
                                            <AddPhotoAlternate className={classes.iconUpload} />
                                            <p class="upload-image-button-text">Upload Image</p>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={8}>
                                    <p className={classes.generalText}>Cover Image (Optional)</p>
                                    <div className={classes.uploadImage} >
                                        <div className={classes.uploadImageContent}>
                                            <AddPhotoAlternate className={classes.iconUpload} />
                                            <p class="upload-image-button-text">Upload Image</p>
                                        </div>
                                    </div>
                                </Grid>

                            </Grid>
                            <div className={classes.fileName}>
                                <TextField required label="File Name (Required)" defaultValue={data.length === 1 ? data[0].fileName : ''} />
                            </div>
                            <div>
                                <p className={classes.generalInfo}>Media Display Time</p>
                                <TextField
                                    id="date"
                                    label="Date (Required)"
                                    type="date"
                                    defaultValue="2017-05-24"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField required label="Tags (Optional)" defaultValue="uploadfile.txt" />
                            </div>
                        </div>
                    )
                }
                {
                    value === 'tags' && (
                        <div className={classes.generalContent}>
                            <p className={classes.generalInfo}>Tagging Media</p>
                            <span className={classes.generalText}>Tags provide a useful way to group related media together and make it easier for people to find content.</span>
                            <div className={classes.fileName}>
                                <TextField required label="Tags (Optional)" defaultValue="" placeholder="Type here and press enter" />
                            </div>
                        </div>
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button autoFocus onClick={handleClose} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog >
    );
}