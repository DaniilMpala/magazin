import React from 'react'
import { Link } from "react-router-dom"
import logo from '../img/logoNew_3.svg'
import '../style/header.scss'


class Header extends React.Component {
    constructor(props) {
        
        super(props)
    }
    componentDidMount() {

    }

    render() {
        return (
            <header>
                <nav>
                    <ul className="iconName">
                        <img src={logo} /> <span className="logoName">SHOP-ACC</span>
                    </ul>
                    <div ref={this.navigation} className="navigation-container">
                        <ul className="navigation">
                            <li >
                                <Link to="/">Главная</Link>
                            </li>
                            <li >
                                <Link to="/rules">Правила</Link>
                            </li>
                            <li >
                                <Link to="/PayCheck">Мои покупки</Link>
                            </li>
                            {/* <li >
                                <Link to="/faq">Как купить?</Link>
                            </li> */}
                        </ul>
                    </div>

                </nav>
            </header >

        )
    }
}

export default Header


