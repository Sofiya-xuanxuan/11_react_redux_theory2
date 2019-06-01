import React, {useState, useEffect, useReducer, useContext} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter, Link, Route, Switch, Redirect} from 'react-router-dom';
import {asyncFetch} from './store/fruit.redux';
import {login} from './store/user.redux'

//水果列表
function FruitList({fruits, setFruit}) {
    return (
        <div>
            <ul>
                {fruits.map(f => (
                    <li key={f} onClick={() => setFruit(f)}>
                        <Link to={`/list/detail/${f}`}>{f}</Link>
                    </li>
                ))}
            </ul>
            <Route path='/list/detail/:fruit' component={Detail}></Route>
        </div>
    )
}

//添加水果
const FruitAdd = connect()(function FruitAdd({dispatch}) {
    const [pname, setPname] = useState('草莓');

    const onAddFruit = (e) => {
        if (e.key === 'Enter') {
            dispatch({type: 'add', payload: pname})
            setPname('');
        }
    }
    return (
        <div>
            <input type="text" value={pname} onChange={e => setPname(e.target.value)} onKeyDown={onAddFruit}/>
        </div>
    )
})

//水果详情
function Detail({match, history}) {
    return (
        <div>
            <h3>{match.params.fruit}</h3>
            <p>.....</p>
            <div>
                <button onClick={history.goBack}>返回</button>
            </div>
        </div>
    )
}

//创建高阶组件包装Route组件使其可以验证用户登录
const PrivateRoute = connect(state => ({
    isLogin: state.user.isLogin
}))(function ({component: Component, isLogin, ...rest}) {
    return (
        <Route
            {...rest}
            render={
                props => isLogin ? (
                    <Component {...props}></Component>
                ) : (
                    <Redirect to={{
                        pathname: '/login',
                        state: {redirect: props.location.pathname}
                    }}
                    />
                )
            }

        >

        </Route>
    )
})


//login组件
const Login = connect(state => ({
    isLogin: state.user.isLogin
}), {login})(function ({location, isLogin, login}) {
    const redirect = location.state.redirect || '/';//重定向地址
    if (isLogin) return <Redirect to={redirect}></Redirect>

    return (
        <div>
            <p>用户登录</p>
            <hr/>
            <button onClick={()=>login('sofiya')}>登录</button>
        </div>
    )
});


const mapStateToProps = state => ({
    fruits: state.fruit.list,
    loading: state.fruit.loading
});

const mapDispatchToProps = {
    asyncFetch
}

export default connect(mapStateToProps, mapDispatchToProps)(function HookTest({fruits, loading, asyncFetch}) {
    //useState参数是状态初始值
    //返回一个数组，第一个元素是状态变量，第二个元素是状态变更函数
    const [fruit, setFruit] = useState('草莓');

    //使用useEffect操作副作用，第一个参是回调函数，第二个参是数组
    //任何的状态变更都会执行useEffect
    //请务必设置依赖选项，如果没有则设置空数组表示仅执行一次
    useEffect(() => {
        console.log('get Fruits');
        asyncFetch(['草莓', '香蕉'])
    }, []);

    //设置依赖选项
    useEffect(() => {
        document.title = fruit;
    }, [fruit]);

    //清除工作
    useEffect(() => {
        const timer = setInterval(() => {
            console.log('应用启动了');
        }, 1000)

        //返回清除函数
        return function () {
            clearInterval(timer)
        }
    }, []);


    return (
        <BrowserRouter>
            <nav>
                <Link to='/list'>水果列表</Link>|
                <Link to='/add'>添加水果</Link>
            </nav>

            <div>
                <Switch>
                    <Route path='/list' render={() => (
                        loading ? (<div>数据加载中...</div>) : (<FruitList fruits={fruits} setFruit={setFruit}/>)
                    )}></Route>

                    <PrivateRoute path='/add' component={FruitAdd}></PrivateRoute>
                    <Route path='/login' component={Login}></Route>
                    <Route component={() => <h3>页面不存在</h3>}></Route>
                </Switch>
            </div>
        </BrowserRouter>
    )
})





