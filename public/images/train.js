const arr = [1,4,2,66,77,88,34,21]
function binarySearch (arr,target){
  let left = 0
  let end = arr.length-1
  while(left<=end){
    let mid = Math.floor((left+end)/2)
    if(arr[mid]===target) return mid
    if(arr[mid]<target){
      left = mid+1
    } else if(arr[mid]>target){
      end = mid-1
    }
  }
  return -1
}
function quickSort(arr){
  if(arr.length<1){
    return arr
  }
  let left = 0
  let end = arr.length-1
  let mid = Math.floor((left+end)/2)
  let leftArr = []
  let rightArray = []
  let equals = []
  for(let i = 0; i < arr.length; i++){
    if(arr[i]===arr[mid])equals.push(arr[i])
    if(arr[i]>arr[mid]){
      rightArray.push(arr[i])
    } else if(arr[i]<arr[mid]){
      leftArr.push(arr[i])
    }
  }
  return [...quickSort(leftArr),...equals,...quickSort(rightArray)]
}

function twoSum(arr,target){
  let res = {}
  let result = []
  for(let i = 0; i < arr.length; i++){
    const diff = target - arr[i]

    if(res[diff]!==undefined){
      result.push(res[diff],arr[i])
    }
    res[arr[i]] = arr[i]
  }
  return result
}

const height = [1,2,1]
function maxArea(arr){
  let left = 0
  let right = arr.length-1
  let maxSum = 0
  while(left < right){
    const minHeight = Math.min(arr[left],arr[right])
    const currentSum = (right-left)*minHeight
    maxSum = Math.max(currentSum,maxSum)
    if(arr[left]<=arr[right]){
      left++
    } else {
      right--
    }
  }
  return maxSum
}

setTimeout(()=>console.log('1'),0)
Promise.resolve().then(()=>{
  console.log('2')
}).then(()=>{
  console.log('3')
}).then(()=>{
  setTimeout(()=>console.log('4'),0)
}).then(()=>{
  console.log('5')
})
new Promise((resolve)=>{
  console.log('6')
  setTimeout(()=>console.log('7'),0)
  resolve
})
setTimeout(()=>console.log('8'),0)
console.log('9')
