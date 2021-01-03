import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Toolbar,
} from '@material-ui/core';
import { colors } from '../../theme'
import tokenLogo from '../../assets/BEEtoken.png'
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
    justifyContent: 'space-around',
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
      backgroundColor: '#cc99cc',
      '& .title': {
        color: colors.white,
      },
      '& .icon': {
        color: colors.white
      }
    },
    '& .title': {
      color: '#cc99cc',
    },
    '& .icon': {
      color: '#cc99cc'
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
      output2: '0',
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
            <Toolbar className={`${classes.gradient}, ${classes.affected}`} >
              <form  onSubmit={(event) => {
                    event.preventDefault()
                    let TokenAmount
                    TokenAmount = this.input.value.toString()
                    TokenAmount = window.web3.utils.toWei(TokenAmount, 'Ether')
                    this.props.StakeBEE(TokenAmount)
                  }}>
                    <Typography>Stake BEE token </Typography>
                  <div className="input-group mb-4">
                    <input
                      type="text"
                      onChange={(event) => {
                        event.preventDefault()
                        const TokenAmount = this.input.value.toString()
                        this.setState({
                          output: TokenAmount 
                        })
                      }}
                      ref={(input) => { this.input = input }}
                      className="form-control form-control-lg"
                      placeholder="0"
                      required />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <img src={tokenLogo} height='32' alt=""/>
                        &nbsp; BEE
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className={ `${classes.gradient}`}>Stake in Etheruem</Button>
                  <Typography>Amount Staked: { window.web3.utils.fromWei(this.props.StakedBEE) } E BEE</Typography>
                  <Typography>My Reward in Etheruem: { window.web3.utils.fromWei(this.props.MyRewardBalance) } E HNY</Typography>
                  <Button type="button" className={ `${classes.gradient}`} onClick={this.props.GetReward}>Claim reward</Button><br/>
                  <Typography>Plz claim before Withdrawing your BEE </Typography>
                  <Button type="button" className={ `${classes.gradient}`} onClick={this.props.Withdraw}>wthdraw E BEE </Button>
              </form>
              <form onSubmit={(event) => {
                    event.preventDefault()
                    let TokenAmount
                    TokenAmount = this.input2.value.toString()
                    TokenAmount = window.web3.utils.toWei(TokenAmount, 'Ether')
                    console.log(TokenAmount)
                    this.props.stakeh(TokenAmount)
                     }}>
                       <br/>
                    <div className="input-group mb-4">
                    <input
                      type="text"
                      onChange={(event) => {
                        event.preventDefault()
                        const TokenAmount = this.input2.value.toString()
                        this.setState({
                          output2: TokenAmount 
                        })
                      }}
                      ref={(input2) => { this.input2 = input2 }}
                      className="form-control form-control-lg"
                      placeholder="0"
                      required />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <img src={tokenLogo} height='32' alt=""/>
                        &nbsp; BEE
                      </div>
                    </div>
                  </div>
                       <Button type="submit" className={ `${classes.gradient}`}>Stake in Harmony</Button>
                       <Typography>Amount Staked: { this.props.StakedHBEE / 10**18 } H BEE</Typography>
                       <Typography>My Reward in Harmony: { this.props.MyRewardBalanceH / 10**18 } H HNY</Typography>
                       <Button type="button" className={ `${classes.gradient}`} onClick={this.props.GetRewardH}>Claim reward</Button><br/>
                      <br/>
                       <Button type="button" className={ `${classes.gradient}`} onClick={this.props.WithdrawH}>wthdraw H BEE </Button>
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
