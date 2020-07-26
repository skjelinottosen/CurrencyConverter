import React from "react";
import ClipLoader from 'react-spinners/ClipLoader';
import { Icon } from "@fluentui/react/lib/Icon";
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

const spinnerCSS = `
  display: block;
  float: right;
  margin-top:0.8rem;
  width:2rem;
  height:2rem;
`;
class CurrencyConverter extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            baseCurrency: null,
            baseInput: 1,
            currency: [],
            selectedBaseCurrency: {
                currency: "",
                rates: ""
            },
            selectedCurrency: {
                currency: "",
                rates: ""
            },
            calculateRate: 0,
            latestUpdateTime: {
                date: "",
                time: ""
            },
            date: new Date()
        };
        /* Binding methods */
        this.handleBaseCurrencyChange = this.handleBaseCurrencyChange.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.handleBaseInputChange = this.handleBaseInputChange.bind(this);
        this.calculateRate = this.calculateRate.bind(this);
        this.handleCurrencySwitch = this.handleCurrencySwitch.bind(this);
    }

    async componentDidMount() {
        await this.getRates('EUR');
        this.calculateRate();
        setInterval(
            () => this.setState({ date: new Date() }),
            1000
        );
    }

    async getRates(props) {
        const apiPath = 'http://data.fixer.io/api/'
        const endpoint = 'latest?';
        const base = props
        const access_key = '<API KEY>';
        const fullPath = apiPath + endpoint + 'access_key=' + access_key + '&base=' + base;
        console.log(fullPath);

        const response = await fetch(fullPath);
        if (response.status === 200) {
            
            const data = await response.json();
            var array = Object.entries(data.rates);
            const selectedBaseCurrency = { ...this.state.selectedBaseCurrency };
            const selectedCurrency = { ...this.state.selectedCurrency };
            const latestUpdateTime = { ...this.state.latestUpdateTime };

            //Converts Unix timestamp from seconds to milliseconds.
            const timestamp = new Date(data.timestamp * 1000);
            const timestampFormatted = new Intl.DateTimeFormat('UTC', {
                 year: 'numeric', month: '2-digit', day: '2-digit', 
                 hour: '2-digit', minute: '2-digit', second: '2-digit' 
                }).format(timestamp);

            //Splits formatteed timestamp into date and time
            const timestampSplit = timestampFormatted.split(",");
            latestUpdateTime.date = timestampSplit[0];
            latestUpdateTime.time = timestampSplit[1];

            //Default values
            array.forEach(array => {
                if (array[0] === 'EUR') {
                    selectedBaseCurrency.currency = array[0];
                    selectedBaseCurrency.rates = array[1];
                }
                else if (array[0] === 'NOK') {
                    selectedCurrency.currency = array[0];
                    selectedCurrency.rates = array[1];
                }
            });

            this.setState({
                latestUpdateTime: latestUpdateTime,
                currency: array,
                selectedBaseCurrency: selectedBaseCurrency,
                selectedCurrency: selectedCurrency,
                isLoading: false
            });
        }
    }

    async handleBaseCurrencyChange(e) {
        const selectedBaseCurrency = { ...this.selectedBaseCurrency };
        const targetArray = e.target.value.split(",");
        selectedBaseCurrency.currency = targetArray[0];
        this.setState({ selectedBaseCurrency: selectedBaseCurrency });
        await this.getRates(this.state.selectedCurrency.currency);
    }

     async handleCurrencyChange(e) {
        const selectedCurrency = { ...this.state.selectedCurrency };
        const targetArray = e.target.value.split(",");
        selectedCurrency.currency = targetArray[0];
        selectedCurrency.rates = targetArray[1];
        await this.setState({ selectedCurrency: selectedCurrency });
        this.calculateRate();
    }

    handleBaseInputChange(e) {
        this.setState({ baseInput: e.target.value });
        this.calculateRate();
    }

    calculateRate() {
        const baseValue = this.state.baseInput;
        const selectedRate = this.state.selectedCurrency.rates;
        const calculateRate = Math.round(baseValue * selectedRate * 1000) / 1000;
        this.setState({ calculateRate: calculateRate });
    }

    async handleCurrencySwitch() {
        let selectedBaseCurrency = { ...this.state.selectedBaseCurrency };
        let selectedCurrency = { ...this.state.selectedCurrency };

        //Switching currency
        let tmp = selectedBaseCurrency;
        selectedBaseCurrency = selectedCurrency;
        selectedCurrency = tmp;

        await  this.setState({ selectedBaseCurrency: selectedBaseCurrency, selectedCurrency: selectedCurrency });
        await this.getRates(this.state.selectedBaseCurrency.currency);
    }

    render() {
        return (
            <main className="main">
                <section className="header-exchange-rates">
                    <h1>Currency Converter</h1>
                    <p className="latest-update-time">Last updated {this.state.latestUpdateTime.date} {this.state.latestUpdateTime.time}</p>
                </section>
                <section className="input-fields">
                    <input className="a-input" type="number" min="0" max="2147483647" step="1" defaultValue={this.state.baseInput} onChange={this.handleBaseInputChange} />
                    <select className="a-select" value={this.state.selectedBaseCurrency.currency + "," + this.state.selectedBaseCurrency.rates} onChange={this.handleBaseCurrencyChange} >
                        {this.state.currency && this.state.currency.map((currency, i) => {
                            return (
                                <option key={i} value={currency} >{currency[0]}</option>
                            )
                        })}
                    </select>
                    <label className="a-label" >Convert to </label>

                    <select className="a-select" value={this.state.selectedCurrency.currency + "," + this.state.selectedCurrency.rates} onChange={this.handleCurrencyChange} >
                        {this.state.currency && this.state.currency.map((currency, i) => {
                            return (
                                <option key={i} value={currency}>{currency[0]}</option>
                            )
                        })}
                    </select>
                    <button className="btn-switch" onClick={this.handleCurrencySwitch}> <Icon iconName="Switch" /></button>

                </section>
                {!this.state.isLoading ?
                    <p className="calculated-rate-output"> {this.state.baseInput} {this.state.selectedBaseCurrency.currency} <span id="equals">equals</span> {this.state.calculateRate} {this.state.selectedCurrency.currency} </p>
                    :
                    <ClipLoader css={ spinnerCSS } />
                }
            </main>
        )
    }
}

export default CurrencyConverter;
