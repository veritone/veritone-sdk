export function msToReadableString (milliseconds, showDays=false, showMilliseconds = false) {
  let dateObject = new Date(milliseconds);
  let numDays = dateObject.getUTCDate() - 1;
  let numHours = dateObject.getUTCHours() + (!showDays ? numDays * 24 : 0);
  let numMinutes = dateObject.getUTCMinutes();
  let numSeconds = dateObject.getUTCSeconds();


  let showHours = showDays || numHours > 0;

  let formattedString = '';
  if (showDays) {
    formattedString += numDays.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':';
  }
  if (showHours) {
    formattedString += numHours.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':';
  }
  formattedString += numMinutes.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':';
  formattedString += numSeconds.toLocaleString(undefined, {minimumIntegerDigits: 2});

  if (showMilliseconds) {
    let numMilliseconds = dateObject.getUTCMilliseconds();
    formattedString += ':' + numMilliseconds.toLocaleString(undefined, {minimumIntegerDigits: 3});
  }

  return formattedString;
}
