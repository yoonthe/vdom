const LevenshteinDistance = (str1, str2, i = 0, j = 0) => {
  console.log(i,j);
  if (str1.length === i) {
    console.log(str2.length - j);
    return str2.length - j;
  }
  if (str2.length === j) {
    console.log(str1.length - i);
    return str1.length - i;
  }
  const cost = str1[i] === str2[j] ? 0 : 1;
  return Math.min(
    LevenshteinDistance(str1, str2, i, j + 1) + 1,
    LevenshteinDistance(str1, str2, i + 1, j) + 1,
    LevenshteinDistance(str1, str2, i + 1, j + 1) + cost,
  )
}
// console.log('last', LevenshteinDistance('abc','adc'));
console.log(LevenshteinDistance('LevenshteinDistance','LevenshtDistance'));
