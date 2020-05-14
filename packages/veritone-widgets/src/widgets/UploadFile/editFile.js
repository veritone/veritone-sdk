import React, { Fragment } from 'react';
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
import Chip from '@material-ui/core/Chip';
import { string, func, bool, shape, arrayOf } from 'prop-types';
import { getDateTimeNow } from '../../shared/util';
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

function EditFileUpload({ open, title, handleClose, data, onChangeDateTime, handlePick, onChangeFileName, uploadResultEdit, handleSave, handleAddTagsCustomize,handleOnChangeTagsCustomize, tagsEditFileUpload, handleRemoveTagsCustomize  }) {
    const [value, setValue] = React.useState('general');
    const classes = useStyles();
    function handleChange(event, newValue) {
        setValue(newValue);
    };
    const tagsEdit = data.length === 1 ? uploadResultEdit.tagsEdit.length && uploadResultEdit.tagsEdit || data[0].tagsEdit : uploadResultEdit.tagsEdit;
    return (
        <Dialog onClose={handleClose} open={open} maxWidth="md">
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {title}
            </DialogTitle>
            <DialogContent dividers className={classes.dialogEditFileContent}>
                {
                    data.length > 1 && (
                        <p className={classes.titleEditMultipleFile}>All values will be overwritten when bulk editing multiple files.</p>
                    )
                }
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
                                        <div
                                            className={classes.uploadImageContent}
                                            data-type={'programImage'}
                                            onClick={handlePick}
                                            style={{ backgroundImage: `url(${data.length === 1 ? uploadResultEdit.getUrlProgramImage || data[0].getUrlProgramImage && data[0].getUrlProgramImage : uploadResultEdit.getUrlProgramImage})` }}
                                        >
                                            <AddPhotoAlternate className={classes.iconUpload} />
                                            <p>Upload Image</p>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={8}>
                                    <p className={classes.generalText}>Cover Image (Optional)</p>
                                    <div className={classes.uploadImage} >
                                        <div
                                            className={classes.uploadImageContent}
                                            data-type={'programLiveImage'}
                                            onClick={handlePick}
                                            style={{ backgroundImage: `url(${data.length === 1 ? uploadResultEdit.getUrlProgramLiveImage || data[0].getUrlProgramLiveImage && data[0].getUrlProgramLiveImage : uploadResultEdit.getUrlProgramLiveImage})` }}
                                        >
                                            <AddPhotoAlternate className={classes.iconUpload} />
                                            <p>Upload Image</p>
                                        </div>
                                    </div>
                                </Grid>

                            </Grid>
                            <div className={classes.fileName}>
                                <TextField
                                    required
                                    label="File Name (Required)"
                                    defaultValue={data.length === 1 ? data[0].fileName : ''}
                                    onChange={onChangeFileName}
                                    error={!(uploadResultEdit.fileName)}
                                    helperText={`${!(uploadResultEdit.fileName) ? 'File Name is required' : ''}`}
                                />
                            </div>
                            <div>
                                <p className={classes.generalInfo}>Media Display Time</p>
                                <TextField
                                    label="Date Time (Required)"
                                    type="datetime-local"
                                    defaultValue={getDateTimeNow()}
                                    className={classes.textField}
                                    onChange={onChangeDateTime}
                                    error={!(uploadResultEdit.dateTime)}
                                    helperText={`${!(uploadResultEdit.dateTime) ? 'Date Time is required' : ''}`}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
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
                                <TextField
                                    id="editFileUpload"
                                    label="Tags (Optional)"
                                    placeholder="Type here and press enter"
                                    onKeyPress={handleAddTagsCustomize}
                                    onChange={handleOnChangeTagsCustomize}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={tagsEditFileUpload}
                                />
                                <div className={classes.listTagsCustomize}>
                                    {
                                        tagsEdit && tagsEdit.map(item => {
                                            return (
                                                <Chip label={item.value} key={item.value} data-name={item.value} onDelete={handleRemoveTagsCustomize(item.value, 'editFileUpload')} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    disabled={!(uploadResultEdit.fileName) || !(uploadResultEdit.dateTime)}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog >
    );
}

EditFileUpload.propTypes = {
    open: bool,
    title: string,
    handleClose: func,
    data: arrayOf(shape({
        fileName: string
    })),
    onChangeDateTime: func,
    handlePick: func,
    onChangeFileName: func
}
export default EditFileUpload;