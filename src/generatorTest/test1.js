//生成器函数在执行时能暂停，后面又能从暂停处继续执行：
function* g() {
    yield 'a';
    yield 'b';
    yield 'c';
    return 'ending';
}

var gen = g()
console.log(gen.next()) // {value: "a", done: false}
console.log(gen.next()) // {value: "b", done: false}
console.log(gen.next()) // {value: "c", done: false}
console.log(gen.next()) // {value: "ending", done: true}