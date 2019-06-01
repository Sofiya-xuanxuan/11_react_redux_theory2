//利用递归执行生成器中所有步骤
function* g() {
    yield 'a';
    yield 'b';
    yield 'c';
    return 'ending';
}

var gen = g()
function next(){
    let { value, done } = gen.next()
    console.log(value) // 依次打印输出 a b c end
    if(!done) next() // 直到全部完成
}
next()