import React from 'react'
import { Link } from "react-router-dom"

class Footer extends React.Component {
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };

    }
    render() {
        return (
            <footer>
                <div>
                    <span>© 2021 НАЗВАНИЕ ALL RIGHT RESERVED</span>
                    <a href="https://freekassa.ru" target="_blank" rel="noopener noreferrer">
                        <img src="https://cdn.freekassa.ru/banners/small-dark-2.png" title="Прием платежей" />
                    </a>
                </div>

                <div>
                    {/* <Link to="/guarantee">Гарантия</Link> */}
                    <Link to="/useful">Полезное</Link>
                </div>
            </footer>
        )
    }
}

export default Footer


