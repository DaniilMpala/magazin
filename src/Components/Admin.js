import React from 'react'
import ax from 'axios'

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.login = React.createRef();
        this.pas = React.createRef();

        this.Name = React.createRef();

        this.oldName = React.createRef();
        this.newName = React.createRef();

        this.desc = React.createRef();
        this.select = React.createRef();
        this.urlFoto = React.createRef();
        this.nameTovar = React.createRef();
        this.price = React.createRef();
        this.tovar = React.createRef();
        this.nameCat = React.createRef();

        this.state = {
            auth: false,
            category: [],
            addUrlFoto: true,
            buylast: []
        }
    }
    componentDidMount() {
        this.loginAx()
    }
    loginAx() {
        ax.post('/loginAdmin', { login: this.login.current.value, password: this.pas.current.value })
            .then(({ data }) => {
                this.setState({
                    allAcc: data.allAcc,
                    auth: data.succes,
                    category: data.category ? data.category : [],
                    buylast: data.buylast ? data.buylast : []
                })
            })
    }
    loadnewItem() {
        console.log(this.nameCat)
        ax.post('/loadnewItem', {
            nameCat: this.nameCat?.current?.value,
            idCategory: this.select.current.value,
            urlFoto: this.urlFoto?.current?.value,
            name: this.nameTovar.current.value,
            tovar: this.tovar.current.value,
            price: this.price.current.value,
            desc: this.desc.current.value
        })
            .then(({ data }) => {
                this.props.notification('other', data)
            })
    }
    render() {
        return (
            <main>
                {!this.state.auth ? <div className="login">
                    <input placeholder="Логин" ref={this.login}></input>
                    <input placeholder="Пароль" ref={this.pas}></input>
                    <button onClick={this.loginAx.bind(this)}>Войти</button>
                </div>
                    :
                    <div className="main-block">
                        <div className="items">
                            <div className="title">
                                <span>Загрузка и редактирование товаров</span>
                            </div>
                            <div className="newItem">
                                <div>
                                    <div>
                                        <div>
                                            <label for="inputState">Выбор категории</label>
                                            <select onChange={(e) => { this.setState({ addUrlFoto: e.target.value == '-1' }) }} ref={this.select}>
                                                <option selected value="-1">Создать новую</option>
                                                {this.state.category.map(({ id, title }) => <option value={id}>{title}</option>)}
                                            </select>
                                        </div>
                                        {this.state.addUrlFoto ? <>
                                            <div>
                                                <label for="inputState">Фото категории</label>
                                                <input ref={this.urlFoto} placeholder="URL" />
                                            </div>
                                            <div>
                                                <label for="inputState">Название категории</label>
                                                <input ref={this.nameCat} placeholder="Название" />
                                            </div>
                                        </> : ""}

                                        <div>
                                            <label for="inputState">Название товара</label>
                                            <input ref={this.nameTovar} placeholder="Название" />
                                        </div>
                                        <div>
                                            <label for="inputState">Цена за 1 шт</label>
                                            <input ref={this.price} placeholder="цена" />
                                        </div>
                                    </div>
                                    <button onClick={this.loadnewItem.bind(this)}>Загрузить товар</button>
                                </div>
                                <div style={{ 'padding-right': '10px' }}>
                                    <label for="inputState">Описание товара</label>
                                    <textarea style={{ 'text-align': 'left' }} ref={this.desc} rows="5" placeholder=""></textarea>
                                </div>
                                <div>
                                    <label for="inputState">Загрузить товар</label>
                                    <textarea ref={this.tovar} rows="5" placeholder="1 аккаунт = 1 строчка"></textarea>
                                </div>

                            </div>
                            <div className="item">
                                <input ref={this.oldName} placeholder='Старое название' style={{ 'padding': '2px', 'margin-top': 0 }} />
                                <input ref={this.newName} placeholder='Новое название' style={{ 'padding': '2px', 'margin-top': 0 }} />
                                <button onClick={() => {
                                    ax.post('/updateName', { oldName: this.oldName.current.value, newName: this.newName.current.value }).then(({ data }) => {
                                        this.props.notification('other', data.message)
                                    })
                                }}>Обновить</button>
                            </div>
                            <div className="item">
                                <input ref={this.Name} placeholder='Название товара' style={{ 'padding': '2px', 'margin-top': 0 }} />
                                <button onClick={() => {
                                    ax.post('/deleteTovar', { Name: this.Name.current.value }).then(({ data }) => {
                                        this.props.notification('other', data.message)
                                    })
                                }}>Удалить наименование</button>
                            </div>
                            <div className="title">
                                <span>Последнии покупки (100)</span>
                            </div>
                            <div>
                                {this.state.buylast.map((v, key) =>
                                    <div className="item" key={key}>
                                        <div style={{ 'width': "auto" }}>
                                            <span>{v.title}</span>
                                        </div>
                                        <div style={{ 'width': "auto" }}>
                                            <span className="colVo">Купили: {v.colVo} шт.</span>
                                            <span >по цене за 1 шт: {v.price} руб.</span>
                                            <span className="colVo">Общая стоимость: {v.price}руб.</span>
                                            <span >{v.email}</span>
                                            <span style={{ 'font-size': '10px', 'color': '#7d7d7d' }} >{v.date}</span>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className="title">
                                <span>Вся база данных (лимит показа 100)</span>
                            </div>
                            
                            <div>
                                {this.state.allAcc.map((v, key) =>
                                    <div className="item" key={key}>
                                        <div style={{ 'width': "auto" }}>
                                            <span>{v.titleAccount}</span>
                                        </div>
                                        <div style={{ 'width': "auto" }}>
                                            <span className="colVo">Цена за шт: {v.price} руб.</span>
                                            <span className="colVo">{v.infoAccount}</span>
                                        </div>
                                    </div>
                                )}
                                {this.state.allAcc.length >= 0 ? <div className="overAcc">
                                    <button onClick={() => {
                                        ax.post('/NextallAcc', { next: false }).then(({ data }) => {
                                            this.setState({
                                                allAcc: data,
                                            })
                                        })
                                    }}>{"<"}</button>
                                    <button onClick={() => {
                                        ax.post('/NextallAcc', { next: true }).then(({ data }) => {
                                            this.setState({
                                                allAcc: data,
                                            })
                                        })
                                    }}>{">"}</button>
                                </div> : ""}
                            </div>
                        </div>
                    </div>
                }
            </main>
        )
    }
}

export default Admin