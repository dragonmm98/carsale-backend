// first solution

function getCompute2 (arr) {
    if (arr.length < 2){
    return arr;}

    const firstIndex = arr.shift();
    arr.push(firstIndex);
    console.log(arr);
}
// second solution

function getCompute1 (arr) {
    if (arr.length < 2){
    return arr;}
    arr.push(arr[0]);
    arr.splice(0, 1)
    console.log(arr);
}

getCompute2(['h', 'e', 'l', 'l', 'o']) 
  

