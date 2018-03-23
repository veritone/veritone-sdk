export function msToReadableString (milliseconds, showDays=false, showMillisec = false) {
  let dateObject = new Date(milliseconds);
  let numDays = dateObject.getUTCDate() - 1;
  let numHours = dateObject.getUTCHours() + (!showDays ? numDays * 24 : 0);
  let numMinites = dateObject.getUTCMinutes();
  let numSeconds = dateObject.getUTCSeconds();
  

  let showHours = showDays || numHours > 0;

  let formatedString = '';
  if (showDays)   formatedString = formatedString + numDays.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':';
  if (showHours)  formatedString = formatedString + numHours.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':';
  formatedString = formatedString + numMinites.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ':';
  formatedString = formatedString + numSeconds.toLocaleString(undefined, {minimumIntegerDigits: 2});

  if (showMillisec) {
    let numMilliseconds = dateObject.getUTCMilliseconds();
    formatedString = formatedString + ':' + numMilliseconds.toLocaleString(undefined, {minimumIntegerDigits: 3});
  }
  
  return formatedString;
}