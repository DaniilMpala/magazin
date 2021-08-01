import React from 'react'
import ax from 'axios'

class PayCheck extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }
    componentDidMount() {
        var params = window.location.search.replace('?', '').split('&').reduce(
                function (p, e) {
                    var a = e.split('=');
                    p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                    return p;
                },
                {}
            );

        ax.post('/PayCheck', { orderid: params['orderid'], email:params['email']})
            .then(({ data }) => {
                this.setState({ data: data.data })
                this.props.notification('other', data.messages)
            })
    }

    render() {
        return (
            <>

            </>
        )
    }
}

export default PayCheck