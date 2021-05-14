## DataPicker Tutorial

**DataPicker**

The Veritone file browser for AI processing. Allows you to browse your files and select specific ones for AI processing with the Veritone platform.

*Required Props in this Component*

* id, string, the id number for the file
* name, string, the name of the file
* onPick, function, the starting file to be used with DataPicker
* endPick, function, the last file to be used with DataPicker
* open, bool, used to open a file (Required to have `open` or `renderButton`)
* renderButton, function, used to render the file access button in the widget (Required to have `open` or `renderButton`)
* uploadToTDo, function, the list of files that will be uploaded
* retryDone, function, used to inform the user the status of if a file can be found
* retryRequest, function, used to request another attempt at searching for a file
* setSearchValue, function, used to find the requested file from the ToDo list
* clearSearch, function, used to clear the search and allow it to search for the next files

*Options:*

* multiple: bool, whether the picker will accept multiple files to upload in a batch
* enableFolders: bool, whether or not the picker accepts uploading folders
* enableUploads: bool, whether or not the picker allows file uploads
* width: number, the width of the datapicker dialog
* height: number, the height of the datapicker dialog

* Widget Component Stories Options*

* All Views Enabled, enables or disables folder and file uploads
* Only Folders, restricts uploads to only folders
* Only Upload, restricts the user to only uploading files
* Single Selection Only, restricts the user to selecting only a single file at a time
* 2 Selection Only, restricts the user to selecting only two files at a time
* Not Fullscreen, the widget is unable to be fullscreen

*Instance methods*

* pick(callback): open the DataPicker dialog.
  * callback signature is (result, { warning, error, cancelled })
    * result: array of result objects, one for each file uploaded
      * key: string, the filename as stored on the server (may include a UUID)
      * fileName: string, the original filename
      * size: number, the file size in bytes
      * type: string, the mime type of the file
      * error: string or `false`, the error that prevented the file from uploading, if any
      * bucket: string, the S3 bucket to which the file was uploaded
      * expiresInSeconds: number, the length of time the credentials in `getUrl` will be valid, in seconds.
      * getUrl: string or `null`, the resulting S3 URL, if successful. Includes credentials that are valid for `expires` seconds.
      * unsignedUrl: string or `null`, the resulting S3 URL, if successful. Does not include credentials and will need to be signed to be used.
    * warning: string or `false`, a warning message if some (but not all) files failed to upload. A warning indicates that `result` contains some successful upload result objects, and some that were not successful (unsuccessful objects will have `error` populated with an error message, as noted above)
    * error: string or `false`, an error message, if all files failed to upload.
    * cancelled: bool, whether or not the DataPicker interaction was cancelled (by the user, or by calling cancel()).

* cancel(): close the DataPicker dialog. The callback provided to pick() will be called with `(null, { cancelled: true })`.


*Sample Code for Implementation*

```javascript

widget = new veritoneWidgets.DataPickerWidget({
   elId: YOUR_HTML_ELEMENT_ID,
   onPick: items => {
     console.log('Items picked: ');
     console.log(items);
   }
 });
 widget.pick(); // open Picker
 widget.cancel(); // close Picker
*/

```
