import React from 'react'
import ax from 'axios'

class PayCheck extends React.Component {
    constructor(props) {
        super(props)
        this.email = React.createRef();
    }
    componentDidMount() {
        // var params = window.location.search.replace('?', '').split('&').reduce(
        //     function (p, e) {
        //         var a = e.split('=');
        //         p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
        //         return p;
        //     },
        //     {}
        // );

        // ax.post('/PayCheck', { orderid: params['orderid'], email: params['email'] })
        //     .then(({ data }) => {
        //         this.setState({ status: data.status })
        //         this.props.notification('other', data.messages)
        //     })
    }

    render() {
        return (
            <>
                <div className="headerMain">
                    <div class="headerMain__left-side">
                        <span className="titleSteam">Спасибо за покупку</span>
                        <p>Ваше письмо отправлено вам на почту с купленным аккаунтом, ПРОВЕРЬТЕ СПАМ!
                            <br/>
                            На данной страницы вы можете получить все свои покупки в магазине
                        </p>
                    </div>
                </div>
                <div className="item">
                    <input ref={this.email} placeholder='Почту которую вы указывали при покупки' style={{'padding':'2px', 'margin-top': 0}} />
                    <button onClick={()=>{ax.post('/PayCheck', {email: this.email.current.value}).then(({data})=> {
                        this.props.notification('other', data.message)
                    })}}>Отправить мне все мои покупки</button>
                </div>
            </>
        )
    }
}

export default PayCheck