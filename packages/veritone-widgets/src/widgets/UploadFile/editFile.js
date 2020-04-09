import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import styles from './styles.scss';
const customStyles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(customStyles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

export default function EditFileUpload({ open, title, handleClose, data }) {
    const [value, setValue] = React.useState('general');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Dialog onClose={handleClose} open={open} className={styles['dialog']} maxWidth="md">
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {title}
            </DialogTitle>
            <DialogContent dividers className={styles['dialog-content']}>
                <Paper className={styles['tabs-content']}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        className={styles['tabs']}
                    >
                        <Tab label="General" value="general" className={styles['tab']} />
                        <Tab label="Tags" value="tags" className={styles['tab']} />
                    </Tabs>
                </Paper>
                {
                    value === 'general' && (
                        <div className={styles['general-content']}>
                            <p className={styles['general-info']}>General Info</p>
                            <span className={styles['general-text']}>Add information to help describe and identify your media </span>
                            <Grid container spacing={3}>
                                <Grid item xs={4}>
                                    <p className={styles['general-text']}>Avatar Image (Optional)</p>
                                    <div className={styles['upload-image']} >
                                        <div className={styles['upload-image-content']}>
                                            <AddPhotoAlternate className={styles['icon-upload']} />
                                            <p class="upload-image-button-text">Upload Image</p>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={8}>
                                    <p className={styles['general-text']}>Cover Image (Optional)</p>
                                    <div className={styles['upload-image']} >
                                        <div className={styles['upload-image-content']}>
                                            <AddPhotoAlternate className={styles['icon-upload']} />
                                            <p class="upload-image-button-text">Upload Image</p>
                                        </div>
                                    </div>
                                </Grid>

                            </Grid>
                            <div className={styles['file-name']}>
                                <TextField required label="File Name (Required)" defaultValue={data.length === 1 ? data[0].fileName : ''} />
                            </div>
                            <div>
                                <p className={styles['general-info']}>Media Display Time</p>
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
                        <div className={styles['general-content']}>
                            <p className={styles['general-info']}>Tagging Media</p>
                            <span className={styles['general-text']}>Tags provide a useful way to group related media together and make it easier for people to find content.</span>
                            <div className={styles['file-name']}>
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