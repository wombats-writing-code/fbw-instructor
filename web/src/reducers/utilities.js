


export const matches = (needle, haystack) => {



  return _.lower(haystack).indexOf(_.lower(needle)) === 0;
}
