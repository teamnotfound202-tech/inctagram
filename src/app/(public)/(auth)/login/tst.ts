type test = {
  name:string
  surname:boolean
  func:number
}
type myPick<T,K extends keyof T>={
  [P in K]:T[P]
}
type copyMyOmit<T,K extends keyof T> = {
[P in keyof T as P extends K?never:P]: T[P]
}

const obj:copyMyOmit<test, 'name'>={
   surname:true,
  func:4
}