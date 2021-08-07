import React from "react";
import ax from "axios";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalWindowData: {},
            data: [],
            count: 1,
            mail: "",
        };
    }
    componentDidMount() {
        ax.post("/loadData").then(({ data }) => {
            this.setState({ data: data });
        });
    }

    Openbuy(id, id2) {
        this.setState({
            modalWindowData: this.state.data
                .find((v) => v.id == id)
                .items.find((v) => v.id == id2),
        });
    }

    buy() {
        ax.post("/buyAcc", {
            mail: this.state.mail,
            count: this.state.count,
            acc: this.state.modalWindowData,
        }).then(({ data }) => {
            if (data.succes) window.location.href = data.url;
            else this.props.notification("lose", data.message);
        });
    }

    render() {
        return (
            <>
                <div className="headerMain">
                    <div class="headerMain__left-side">
                        <span className="titleSteam">Аккаунты Steam</span>
                        <p>
                            Добро пожаловать в магазин SHOP-ACC, где вы сможете купить
                            аккаунты Steam с играми напрямую у игроков без переплат.
                            Сделки защищены гарантом безопасности. Мы продаем аккаунты
                            полученные только легальным путем.
                        </p>
                    </div>

                    <div class="headerMain__right-side">
                        <div class="titleSteam__planet planet">
                            <div class="planet__row">
                                <img class="planet-steam" src="img/Steam.svg" />
                                <img class="planet-origin" src="img/origin.svg" />
                                <img class="planet-uplay" src="img/uplay.svg" />
                                <img class="planet-epic" src="img/epic.svg" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="items">
                    {this.state.data.map((e, key) => {
                        return (
                            <>
                                <div className="title">
                                    <span>{e.title}</span>
                                </div>
                                {e.items.map((v, key) => (
                                    <div className="item" key={key}>
                                        <div>
                                            <img src={e.urlPhoto}></img>
                                            <div class="item-title">
                                                {v.title}
                                                <div class="item-title__info">
                                                    <p>{v.desc}</p>

                                                    <p>
                                                        После оплаты Вы получаете ссылку
                                                        на скачивание архива, в котором
                                                        лежат:
                                                        <br />
                                                        <br />
                                                        1.&nbsp;Файл с данными, а именно:
                                                        <br />
                                                        &nbsp;
                                                        &nbsp;&nbsp;&bull;&nbsp;&nbsp;логин
                                                        и пароль от аккаунта
                                                        <br />
                                                        &nbsp;
                                                        &nbsp;&nbsp;&bull;&nbsp;&nbsp;логин
                                                        и пароль от родной почты
                                                        <br />
                                                        &nbsp;
                                                        &nbsp;&nbsp;&bull;&nbsp;&nbsp;привязанный
                                                        номер телефона и код из SMS
                                                        <br />
                                                        &nbsp;
                                                        &nbsp;&nbsp;&bull;&nbsp;&nbsp;ссылка
                                                        на профиль
                                                        <br />
                                                        <br />
                                                        2.&nbsp;Файл&nbsp;для получения
                                                        кодов из&nbsp;SteamGuard
                                                        <br />
                                                        3.&nbsp;Очень подробная инструкция
                                                        по входу в аккаунт
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="colVo">{v.colVo} шт.</span>
                                            <span>Цена за 1шт.</span>
                                            <span className="colVo">{v.price}руб.</span>

                                            <button
                                                data-bs-toggle="modal"
                                                data-bs-target="#Modal"
                                                onClick={this.Openbuy.bind(
                                                    this,
                                                    e.id,
                                                    v.id
                                                )}
                                            >
                                                Купить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        );
                    })}
                    <div
                        class="modal fade"
                        id="Modal"
                        tabindex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">
                                        Оплата заказа
                                    </h5>
                                    <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div class="modal-body">
                                    <div>
                                        <label>Почта</label>

                                        <input
                                            value={this.state.mail}
                                            onChange={(e) => {
                                                this.setState({ mail: e.target.value });
                                            }}
                                            placeholder="Ваша почта для отправки данных"
                                        />
                                    </div>
                                    <div>
                                        <label>Количество</label>
                                        <input
                                            value={this.state.count}
                                            onChange={(e) => {
                                                this.setState({
                                                    count:
                                                        !isNaN(e.target.value) &&
                                                        e.target.value.trim()
                                                            ? e.target.value
                                                            : this.state.count,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <span>
                                        Итоговая сумма:{" "}
                                        {(
                                            this.state.count *
                                            this.state.modalWindowData.price
                                        ).toFixed(2)}{" "}
                                        руб.
                                    </span>
                                    <button
                                        onClick={this.buy.bind(
                                            this,
                                            this.state.modalWindowData
                                        )}
                                        disabled={!this.state.mail}
                                        type="button"
                                    >
                                        Купить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Main;
