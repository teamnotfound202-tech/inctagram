//1 task
const user = {
    id: 1,
    profile: {
        name: "Alex",
        age: 25
    }
};

// Твоя задача — написать типизацию для этой функции
function getDeepValue<T,K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

const userName = getDeepValue(user, 'profile'); // OK
const error = getDeepValue(user, 'address'); // Должна быть ошибка TS: 'address' does not exist
//2 task
type MyFunc = (id: number) => { name: string; age: number };
type GetReturnType<T>=T extends (...args:unknown[])=>infer U? U:never
type Result = GetReturnType< MyFunc>;
// Ожидаемый результат: { name: string; age: number }

type ErrorCase = GetReturnType<string>;
//3 task
interface User {
    name: string;
    age: number;
}

// Твоя задача создать такой тип:
type UserSetters = {
    [K in keyof User as `set${Capitalize<K>}`]: (value: User[K]) => void;
};


interface Config {
    api: {
        url: string;
        timeout: number;
    };
    theme: "dark" | "light";
}
type DeepPartial<T extends object> = {
    [K in keyof T ]?:T[K] extends object ? DeepPartial<T[K]> : T[K];
}
type PartialConfig = DeepPartial<Config>;

const myConfig: PartialConfig = {
    api: {
        url: "localhost" // timeout здесь уже не обязателен
    }
};
//5 task
type Brand<K, T> = T & { __brand: K };

type UserId = Brand<'UserId', string>;
type ProductId = Brand<'ProductId', string>;

function getUserData(id: UserId) { /* ... */ }

const myUserId = "123" as UserId;
const myProdId = "456" as ProductId;

getUserData(myUserId); // OK
getUserData(myProdId); // ОШИБКА: ProductId не является UserId
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


const obj = {
  id:5,
  name:'sgs',
  age:5
}
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>{
  const newObj:Pick<T, K> = {...obj}
 for(const k in newObj) {
   if(!keys.includes(k)){
     delete newObj[k];
   }
 }
  return newObj
}
console.log(pick(obj,['id','age']))
  //Реализуй debounce(fn, delay)
Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const originalFunc = this;

  return function(...callArgs) {
    return originalFunc.apply(thisArg, [...boundArgs, ...callArgs]);
  };
};
const config = {
  server: {
    host: 'localhost',
    port: 8080,
    features: {
      auth: true,
      payments: false,
    },

  },
mock:'me'
};
type ReadOnly<T> = T extends object
  ? { readonly [K in keyof T]: ReadOnly<T[K]> }
  : T;
type m =ReadOnly<typeof config>
type FormErrors<T> = {
  [K in keyof T]?: string;
};
function validateForm<T>(data: T): FormErrors<T>{
  const res = {} as FormErrors<T>;
  for(const k in data ){
    if(typeof data==='object' && data?.hasOwnProperty(k)){
      res[k] ='required';
    }

  }
  return res;
}

type MyReturnType<T> = T extends (...args:infer _P)=>infer U ? U :never
type MyParameters<T> = T extends (...args:infer U)=>unknown ? U : never

type Make = (a:string,b:number)=> { name: string; age: number };
function makeUser(id: number, name: string) {
  return { id, name}
}
type R = MyReturnType<typeof makeUser>
const r:R = makeUser(18,'18')
/*
1) DeepUnwrapPromise
Тесты:
  type T1 = DeepUnwrapPromise<Promise<string>>;              // string
type T2 = DeepUnwrapPromise<Promise<Promise<number>>>;     // number
type T3 = DeepUnwrapPromise<boolean>;   */
type DeepUnwrapPromise<T> =
  T extends Promise<infer U>
    ? DeepUnwrapPromise<U>
    : T;
type Data = {
  id: string;
  meta: { createdAt: Date; tags: string[] };
  cache: { hits: number[] };
  fn: (x: number) => string;
};
type DeepReadonlyExcept<T,Exceptions > = T extends object ? {
  // исключённые ключи — не readonly
  [K in keyof T as K extends Exceptions ? K : never]: T[K]
} & {
  // остальные — readonly + deep
  readonly [K in keyof T as K extends Exceptions ? never : K]:
  DeepReadonlyExcept<T[K], Exceptions>
}
  // 4) примитивы и т.п.
  : T;
type RR = DeepReadonlyExcept<Data, "hits">;


/*
* StringKeys<T>
Требования:
  * из keyof T оставить только строковые ключи (без number/symbol), используя Extract*/
type  GetterName<K extends string> = `get${Capitalize<K>}`


type Person = {
  id: number
  name: string
  age: number
}
type  Getters<T>={
  [K in keyof T as K extends string ? GetterName<K>:never]: ()=>T[K]
}
type Model = {
  id: number
   name: string
   save: () => void
   toJSON: () => string
   createdAt: string
}
type NonFunctionProps<T> = {
  [P in keyof T as T[P] extends (...args:unknown[])=>unknown? never : P]: T[P]
}

  // если K = "name" → "getName"
// если K = "createdAt" → "getCreatedAt"