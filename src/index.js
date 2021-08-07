import React from 'react'
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom"


import "./style/style.scss"
import "./style/notification.scss"

import Main from './Components/Main'
import Useful from './Components/Useful'
import Rules from './Components/Rules'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Admin from './Components/Admin'
import PayCheck from './Components/PayCheck'

var timerSocket;
var notification;

//  localhost:3031 http://185.244.173.185/
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.notificationText = React.createRef();
        this.Notification = this.Notification.bind(this);
        this.notification = React.createRef();
    }
  
    componentDidMount() {

    }
    componentWillUnmount() {

    }
    Notification(type, text) {
        if (this.notification.current != null && type && text) {
            clearTimeout(notification)
            this.notification.current.classList.remove("other")
            this.notification.current.classList.remove("win")
            this.notification.current.classList.remove("lose")
            this.notification.current.classList.add(type)
            this.notificationText.current.innerText = text

            notification = setTimeout(() => {
                if (this.notification.current != null) {
                    this.notification.current.classList.remove("other")
                    this.notification.current.classList.remove("win")
                    this.notification.current.classList.remove("lose")
                    this.notificationText.current.innerText = ""
                }
            }, 5000);
        }else{
            clearTimeout(notification)
            if (this.notification.current != null) {
                this.notification.current.classList.remove("other")
                this.notification.current.classList.remove("win")
                this.notification.current.classList.remove("lose")
                this.notificationText.current.innerText = ""
            }
        }
    }

    render() {
        return (
            <Router>
                <div id="body">

                    <button onClick={this.Notification.bind(this, undefined)} ref={this.notification} className="notification">
                        <span ref={this.notificationText} className="notification__text"></span>
                    </button>

                    <Header  />

                    <div className="container">

                        <div className="main-block">

                            <Switch>
                                <Route path="/" exact component={() => (<Main notification={this.Notification} />)} />
                                <Route path="/rules" exact component={() => (<Rules/>)} />
                                <Route path="/useful" exact component={() => (<Useful/>)} />
                                <Route path="/PayCheck" exact component={() => (<PayCheck notification={this.Notification} />)} />
                                <Route path="/admin" exact component={() => (<Admin notification={this.Notification}/>)} />
                            </Switch>
                        </div>
                    </div>
                    <Footer />
                </div>
            </Router>
        )
    }
}


ReactDOM.render(
    <Index />,
    document.getElementById('root')
)


