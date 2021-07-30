import React from 'react'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalWindowData: {},
            data: [
                {
                    id: "1",
                    title: "С открытой торговой площадкой — Россия",
                    items: [
                        {
                            id: "1",
                            title: "Аккаунты steam c 4 LVL + уже открытая торговая площадка и рабочий обмен",
                            colVo: 10,
                            price: 499
                        },
                        {
                            id: "2",
                            title: "Аккаунты steam c 4 LVL + уже открытая торговая площадка и рабочий обмен",
                            colVo: 10,
                            price: 499
                        },
                    ]
                },
                {
                    id: "1",
                    title: "С открытой торговой площадкой — Россия",
                    items: [
                        {
                            id: "1",
                            title: "Аккаунты steam c 4 LVL + уже открытая торговая площадка и рабочий обмен",
                            colVo: 10,
                            price: 499
                        },
                        {
                            id: "2",
                            title: "Аккаунты steam c 4 LVL + уже открытая торговая площадка и рабочий обмен",
                            colVo: 10,
                            price: 499
                        },
                    ]
                }
            ]
        }
    }
    componentWillUnmount() {

    }

    Openbuy(id, id2) {
        this.setState({
            modalWindowData: this.state.data.find(v => v.id == id).items.find(v => v.id == id2)
        })
    }

    render() {
        return (
            <>
                <div className="headerMain">
                    <span className="titleSteam">Аккаунты Steam</span>
                    <p>Добро пожаловать в магазин SHOP-ACC, где вы сможете купить аккаунты Steam с играми напрямую у игроков без переплат. Сделки защищены гарантом безопасности. Мы продаем аккаунты полученные только легальным путем.</p>
                </div>
                <div className="items">
                    {this.state.data.map((e, key) => {
                        return (
                            <>
                                <div className="title">
                                    <span>{e.title}</span>
                                </div>
                                {
                                    e.items.map((v, key) =>
                                        <div className="item" key={key}>
                                            <div>
                                                <img src="https://stixed.ru/assets/Deer_new_stixed/img/50px/Steam.png"></img>
                                                <span>{v.title}</span>
                                            </div>
                                            <div>
                                                <span className="colVo">{v.colVo} шт.</span>
                                                <span>Цена за 1шт.</span>
                                                <span className="colVo">{v.price}руб.</span>
                                                <button data-bs-toggle="modal" data-bs-target="#Modal" onClick={this.Openbuy.bind(this, e.id, v.id)}>Купить</button>
                                            </div>
                                        </div>
                                    )
                                }
                            </>)
                    })}
                    <div class="modal fade" id="Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Оплата заказа</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div>
                                        <label>Почта</label>
                                        <input placeholder="Ваша почта" />
                                    </div>
                                    <div>
                                        <label>Количество</label>
                                        <input value="1" />
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <span>Итоговая сумма</span>
                                    <button type="button">Купить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default Main