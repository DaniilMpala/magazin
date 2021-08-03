import React from "react";
import { Link } from "react-router-dom";

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
                    <span>© 2021 SHOP-ACC. ALL RIGHT RESERVED</span>
                    <a href="https://freekassa.ru" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://cdn.freekassa.ru/banners/small-dark-1.png"
                            title="Прием платежей на сайте"
                        />
                    </a>
                </div>

                <div>
                    Поддержка: <a href="mailto:support@dedrimmer.xyz">support@dedrimmer.xyz</a>
                </div>

                <div>
                    {/* <Link to="/guarantee">Гарантия</Link> */}
                    <Link to="/useful">Полезное</Link>
                </div>
            </footer>
        );
    }
}

export default Footer;
