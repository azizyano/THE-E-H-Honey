import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Typography,
  Toolbar,
} from '@material-ui/core';
import { colors } from '../../theme'

import logoh from '../../assets/hnylogo.png'
import tokenLogo from '../../assets/BEEtoken.png'
import ethLogo from '../../assets/ethlogo.png'
//import ColoredLoader from '../loader/coloredLoader'
//import Loader from '../loader'
import Snackbar from '../snackbar'
// Added
import Store from "../../stores";
// using the injected MetaMask provider

const store = Store.store

const styles = theme => ({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    flex: 1,
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    }
  },

  card: {
    flex: '1',
    height: '25vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    borderRadius: '0px',
    transition: 'background-color 0.2s linear',
    [theme.breakpoints.up('sm')]: {
      height: '100vh',
      minWidth: '20%',
      minHeight: '50vh',
    }
  },
  gradient: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: '#00AEE9',
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: '#14044d',
    },
    '& .icon': {
      color: '#14044d'
    },
  },
  green: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: colors.compoundGreen,
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: colors.compoundGreen,
    },
    '& .icon': {
      color: colors.compoundGreen
    },
  },
  title: {
    padding: '24px 0 12px 0',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '12px'
    }
  },
  subTitle: {
    padding: '0 0 12px 0',
    fontSize: '12px',
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '12px'
    }
  },
  icon: {
    fontSize: '60px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '100px',
    }
  },
  link: {
    textDecoration: 'none'
  },
  content: {
    textAlign: 'center'
  }
});

class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      output: '0',
      snackbarMessage: null,
      snackbarType: null,
      loading: false,
      account: store.getStore('account')
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <img src={logoh} alt="project Logo" />
        
           <Toolbar className={`${classes.gradient}, ${classes.affected}`}>
           <Typography>BEE token is a token that you can find in etheruem and harmony block chain. <br/>
           In this project we offer to you, swap BEE/ETH function to buy and sell BEE and and also farm it in both chain. <br/>
           at any time you can use the <a href="https://testnet.bridge.hmny.io/erc20" target="_blank" rel="noopener noreferrer">Harmony bridge</a> to jump from chain to other.
            </Typography>
            </Toolbar>
            <Toolbar className={`${classes.gradient}, ${classes.affected}`}>
            <form className="input-group mb-4" onSubmit={(event) => {
                    event.preventDefault()
                    let etherAmount
                    etherAmount = this.input.value.toString()
                    console.log(etherAmount)
                    etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
                    this.props.buyTokens(etherAmount)
                  }}>
                    <Typography>Buy BEE token </Typography>
                  <div className="input-group mb-4">
                    <input
                      type="text"
                      onChange={(event) => {
                        const etherAmount = this.input.value.toString()
                        this.setState({
                          output: etherAmount * 99
                        })
                      }}
                      ref={(input) => { this.input = input }}
                      className="form-control form-control-lg"
                      placeholder="0"
                      required />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <img src={ethLogo} height='32' alt=""/>
                        &nbsp;&nbsp;&nbsp; ETH
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="0"
                      value={this.state.output}
                      disabled
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <img src={tokenLogo} height='32' alt=""/>
                        &nbsp; BEE
                      </div>
                    </div>
                  </div>
                  <div className="mb-5">
                    <span className="float-left text-muted">Exchange Rate </span>
                    <span className="float-right text-muted">1 ETH = 99 BEE</span>
                  </div>
                  <Button type="submit" className={ `${classes.gradient}`}>Buy BEE</Button>
                </form> 
                </Toolbar>           
          

      </div>
    )
  };

  nav = (screen) => {
    this.props.history.push(screen)
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={snackbarType} message={snackbarMessage} open={true} />
  };


}

export default (withRouter(withStyles(styles)(Home)));
