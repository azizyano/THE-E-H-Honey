import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Switch,
  Route
} from "react-router-dom";
import IpfsRouter from 'ipfs-react-router'
import Token from './ethabis/beeToken.json'
import Honey from './ethabis/honey.json'
import EthSwap from './ethabis/EthSwap.json'
import interestTheme from './theme';

import Account from './components/account';
import Home from './components/home';
import Stake from './components/stake';
import Sellbee from './components/sellBee';
import config from "./config";
import Header from './components/header';
import Web3 from 'web3'
import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED
} from './constants'

import Store from "./stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class App extends Component {
  state = {
    account: null,
    headerValue: null,
    ethaccount: '',
    oneaccount:  '',
    token: {},
    ethSwap: {},
    HNY:{},
    Htoken: {},
    ethBalance: '0',
    BeeBalance: '0',
    HNYBalance: '0',
    StakedBEE: '0',
    fundAddress: '0x9485e4E87D834523Dc9481Fb4EfaE7bb07a2b862',
    MyRewardBalance: '0',
    TotalStakedSupply: '0',
    loading: true
  };
//loading ethereum and harmony blockchain
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadBlockchainData() {
    const hmy = store.getStore('hmy')
    const account = store.getStore('account')
    let stakeInH = hmy.client.contracts.createContract(require('./abi/Hhoney.json'), config.addresses.honey)
    let StakedHBEE = await stakeInH.methods.getAddressStakeAmount(account.address).call()
    this.setState({StakedHBEE:StakedHBEE.toString() })
    let MyRewardBalanceH = await stakeInH.methods.myRewardsBalance(account.address).call()
    MyRewardBalanceH = parseFloat(MyRewardBalanceH)
    this.setState({MyRewardBalanceH: MyRewardBalanceH})
    let HHnyBalance = await stakeInH.methods.balanceOf(account.address).call()
    HHnyBalance = parseFloat(HHnyBalance)
    this.setState({HHnyBalance: HHnyBalance})

    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ ethaccount: accounts[0] })

    let ethBalance = await web3.eth.getBalance(this.state.ethaccount)
    this.setState({ ethBalance: ethBalance.toString() })

    // Load Token
    const networkId =  await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      let Beebalance = await token.methods.balanceOf(this.state.ethaccount).call()
      this.setState({ BeeBalance: Beebalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId]
    if(ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      let ad = ethSwapData.address
      
      this.setState({ ethSwap: ethSwap, addressSwap:ad })

    } else {
      window.alert('EthSwap contract not deployed to detected network.')
    }

    // Load honey
    const honeyData = Honey.networks[networkId]
    if(honeyData) {
      const honey = new web3.eth.Contract(Honey.abi, honeyData.address)
      const haddress = honeyData.address
      this.setState({ honey: honey, haddress: haddress  })
      let HNYBalance = await honey.methods.balanceOf(this.state.ethaccount).call()
      let MyRewardBalance = await honey.methods.myRewardsBalance(this.state.ethaccount).call()
      let StakedBEE = await honey.methods.getAddressStakeAmount(this.state.ethaccount).call()
      let TotalStakedSupply = await honey.methods.totalStakedSupply().call()
      this.setState({ StakedBEE: StakedBEE.toString() })
      this.setState({ HNYBalance: HNYBalance.toString() })
      this.setState({ MyRewardBalance: MyRewardBalance.toString() })
      this.setState({ TotalStakedSupply: TotalStakedSupply.toString() })
    } else {
      window.alert('HONEY contract not deployed to detected network.')
    }
    this.setState({ loading: false })
  }

  // fuction contract for ETH blockchain
  buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.ethSwap.methods.buybees().send({ value: etherAmount, from: this.state.ethaccount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }
  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.addressSwap, tokenAmount).send({ from: this.state.ethaccount }).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellbees(tokenAmount).send({ from: this.state.ethaccount }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }
  StakeBEE = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.haddress, tokenAmount).send({ from: this.state.ethaccount }).on('transactionHash', (hash) => {
      this.state.honey.methods.stake(tokenAmount).send({ from: this.state.ethaccount }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }
  GetReward = () => {
    this.setState({ loading: true })
    this.state.honey.methods.getReward().send({ from: this.state.ethaccount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }
  Withdraw = (amount) => {
    this.setState({ loading: true })
    amount = this.state.StakedBEE
    this.state.honey.methods.withdraw(amount).send({ from: this.state.ethaccount }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }
   // fuction contract for Harmony blockchain
  WithdrawH = (amount) => {
    const wallet = store.getWallet();
    const hmy = store.getStore('hmy')
    let stakeInH = hmy.client.contracts.createContract(require('./abi/Hhoney.json'), config.addresses.honey)
    stakeInH = wallet.attachToContract(stakeInH)
    amount = this.state.StakedHBEE
    stakeInH.methods.withdraw(amount).send({gasPrice: 1000000000, gasLimit: 210000 })
    .then((answer) => {
      if (answer.status === 'called' || answer.status === 'call') {
        const url = `${hmy.explorerUrl}/tx/${answer.transaction.receipt.transactionHash}`
        
        window.alert('Done! ' )
      } else {
        window.alert("transaction failed")
      } 
    })
    .catch((err) => {
      window.alert("An error occurred")
    })
  }
  GetRewardH = async () => {
    const wallet = store.getWallet();
    const hmy = store.getStore('hmy')
    let stakeInH = hmy.client.contracts.createContract(require('./abi/Hhoney.json'), config.addresses.honey)
    stakeInH = wallet.attachToContract(stakeInH)
    stakeInH.methods.getReward().send({gasPrice: 1000000000, gasLimit: 210000 })
    .then((answer) => {
      if (answer.status === 'called' || answer.status === 'call') {
        const url = `${hmy.explorerUrl}/tx/${answer.transaction.receipt.transactionHash}`
        window.alert('Done! ' )
      } else {
        window.alert("transaction failed")
      } 
    })
    .catch((err) => {
      console.log("An error occurred2")
    })
  }
  stakeh = async (HBeeAmount) => {
    const wallet = store.getWallet();
    const hmy = store.getStore('hmy')
    const account = store.getStore('account')

    let HBee = hmy.client.contracts.createContract(require('./abi/ERC20.json'), config.addresses.token)
    let stakeInH = hmy.client.contracts.createContract(require('./abi/Hhoney.json'), config.addresses.honey)
    stakeInH = wallet.attachToContract(stakeInH)
    HBee = wallet.attachToContract(HBee)
    HBee.methods.approve(config.addresses.honey, HBeeAmount).send({gasPrice: 1000000000, gasLimit: 6721900 ,from: account.address }).then((event) => {
      stakeInH.methods.stake(HBeeAmount).send({gasPrice: 1000000000, gasLimit: 210000,from: account.address })
        .then((answer) => {
          if (answer.status === 'called' || answer.status === 'call') {
            const url = `${hmy.explorerUrl}/tx/${answer.transaction.receipt.transactionHash}`
            window.alert('Done! ' )
          } else {
            window.alert("transaction failed")
          } 
        })
        .catch((err) => {
          window.alert("An error occurred")
        }) 
        });
  }
  //update the state
  setHeaderValue = (newValue) => {
    this.setState({ headerValue: newValue })
  };

  componentDidMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);

    const wallet = store.getWallet();
    if (wallet && wallet.isAuthorized) {
      emitter.emit(CONNECTION_CONNECTED);
    }
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
  };

  getBalancesReturned = () => {
    window.setTimeout(() => {
      dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
    }, 5000)
  }

  configureReturned = () => {
    //TODO: replace here!!!
    //dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })
    dispatcher.dispatch({ type: CONFIGURE, content: {} })
    dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  render() {

    const { account } = this.state

    return (
      <MuiThemeProvider theme={ createMuiTheme(interestTheme) }>
        <CssBaseline />
        <IpfsRouter>
          { !account &&
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              minWidth: '100vw',
              justifyContent: 'center',
              alignItems: 'center',
              background: "#f9fafb"
            }}>
              <Account />
            </div>
          }
          { account &&
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              justifyContent: 'center',
              alignItems: 'center',
              background: "#f9fafb"
            }}>
              { account && <Header 
              ethBalance={this.state.ethBalance}
              BeeBalance={this.state.BeeBalance}
              HNYBalance={this.state.HNYBalance}
              HHnyBalance={this.state.HHnyBalance}
          /> }
              <Switch>
                <Route path="/">
                  <Home 
                  buyTokens={this.buyTokens}
                  />
                  <Stake 
                  ethaccount= {this.state.ethaccount}
                  ethBalance={this.state.ethBalance}
                  BeeBalance={this.state.BeeBalance}
                  HNYBalance={this.state.HNYBalance}
                  StakedBEE={this.state.StakedBEE}
                  StakedHBEE={this.state.StakedHBEE}
                  MyRewardBalance={this.state.MyRewardBalance}
                  MyRewardBalanceH={this.state.MyRewardBalanceH}
                  TotalStakedSupply={this.state.TotalStakedSupply}
                  StakeBEE={this.StakeBEE}
                  GetReward={this.GetReward}
                  GetRewardH={this.GetRewardH}
                  Withdraw={this.Withdraw}
                  WithdrawH={this.WithdrawH}
                  stakeh={this.stakeh}
                  />
                  <Sellbee
                  sellTokens={this.sellTokens}
                  />
                </Route>
              </Switch>
            </div>
          }
          
        </IpfsRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
