import React from 'react'
import ax from 'axios'

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.login = React.createRef();
        this.pas = React.createRef();
        this.state = {
            auth: false
        }
    }
    componentDidMount() {
        this.loginAx()
    }
    loginAx() {
        ax.post('/loginAdmin', { login: this.login.current.value, password: this.pas.current.value })
            .then(({ data }) => this.setState({ auth: data }))
    }
    render() {
        return (
            <main>
                <div className="login">
                    <input placeholder="Логин" ref={this.login}></input>
                    <input placeholder="Пароль" ref={this.pas}></input>
                    <button onClick={this.loginAx.bind(this)}>Войти</button>
                </div>
            </main>
        )
    }
}

export default Admin