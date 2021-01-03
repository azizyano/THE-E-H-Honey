import React, { Component } from "react";
import {
  Typography,
  Button,
  Grid,
  Toolbar
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { colors } from "../../theme";

import {
  CONNECTION_DISCONNECTED,
  GET_BALANCES_PERPETUAL_RETURNED
} from '../../constants'

import Store from "../../stores";
const store = Store.store
const emitter = Store.emitter

const styles = theme => ({
  root: {
    background: 'linear-gradient(45deg, #14044d 30%, #79e7e7 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 100,
    padding: '0 30px',
  },
  root1: {
    background: 'linear-gradient(45deg, #00AEE9 30%, #79e7e7 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 100,
    padding: '0 30px',
  },
  headerContainer: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 999
  },
  actionButton: {
    background: '#bcecfd',
    color: '#00AEE9',
    borderColor: '#00AEE9',
    '&:hover': {
      color: `${colors.white} !important`
    }
  },
  gradient: {
    backgroundColor: colors.white,
    '&:hover': {
      backgroundColor: '#00AEE9',
      '& .title': {
        color: `${colors.white} !important`
      },
      '& .icon': {
        color: `${colors.white} !important`
      }
    },
    '& .title': {
      color: '#00AEE9',
    },
    '& .icon': {
      color: '#00AEE9'
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
})

class Header extends Component {

  constructor(props) {
    super()

    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    emitter.on(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
  };

  componentWillUnmount() {
    emitter.removeListener(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
  };

  getBalancesReturned = () => {
    this.setState({ loading: false })
  }

  render() {
    const { classes } = this.props
    const { loading } = this.state

    const tokens = store.getStore('tokens');
    const HBeeBalance = (tokens && tokens.length >= 1) ? tokens[0].balance : 0;
    const ethBalence =  this.props.ethBalance
    return (
      <div className={ classes.headerContainer }>
        <Toolbar className={`${classes.gradient}, ${classes.affected}`}>
        <Button
          className={ classes.gradient }
          variant="outlined"
          color="primary"
          onClick={ this.signoutClicked }
          disabled={ loading }>
          <Typography>Disconnect</Typography>
        </Button>
        <Grid  className={classes.root}>
        <Typography>Your balance </Typography>
        <Typography>{ ethBalence / 10**18 } ETH</Typography> <br/>
        </Grid>
        <Grid  className={classes.root}>
        <Typography>Etheruem Blockchain</Typography>
          <Typography>{ this.props.BeeBalance / 10**18} <a href="https://kovan.etherscan.io/token/0x34b8b7d59e645e88ee8bbfece6657f3c187f0f08" target="_blank" rel="noopener noreferrer">E BEE</a></Typography>
          <Typography>{ this.props.HNYBalance / 10**18} <a href="https://kovan.etherscan.io/token/0xffa20ee7f9044f4794b85ae5d5ebc48f98afc913" target="_blank" rel="noopener noreferrer">E HNY</a></Typography>
        </Grid>
        <Grid  className={classes.root1}>
        <Typography>Harmony Blockchain</Typography>
          <Typography>{ HBeeBalance } <a href="https://explorer.pops.one/#/address/one1u5u0d6ttztdkyema5vkhpvdp3anlfwqks27m6a" target="_blank" rel="noopener noreferrer">H BEE</a></Typography>
          <Typography>{ this.props.HHnyBalance / 10**18 } <a href="https://explorer.pops.one/#/address/one19nljwtt5xla9t6ry5gwqrhsy764f0jm7ek4ghk" target="_blank" rel="noopener noreferrer">H HNY</a></Typography>
        </Grid>
          
        </Toolbar>
        

      </div>
    );
  }

  signoutClicked = () => {
    const wallet = store.getWallet();
    
    if (wallet) {
      wallet.signOut().then(() => {
        store.setStore({ wallet: null, account: null })
        emitter.emit(CONNECTION_DISCONNECTED)
      });
    }
  }
}

export default (withStyles(styles)(Header));
