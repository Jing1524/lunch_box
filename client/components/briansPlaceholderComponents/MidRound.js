import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { getPartyInfo } from '../../store/party';
import { useParams, useLocation } from 'react-router-dom';
import { pickACard, guessed, skip } from '../../store/lunchbox';

import CountdownClock from '../CountDown';
import VideoCall from '../VideoCall'

import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { RefreshSharp } from '@material-ui/icons';

//if team a - left aligned  classes: leftA
//if team b -  right alligned classes: rightB

const useStyles = makeStyles((theme) => ({
  countDown: {
    position: 'relative',
    height: 'calc(100vh - 200px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  gameScreen: {
    position: 'relative',
    right: '0',
    height: 'calc(100vh - 200px)',
  },
  colLeft: {
    position: 'relative'
  },
  colCenter: {
    position: 'relative',
    justifyContent: 'center'
  },
  colRight: {
    position: 'relative'
  }
}));

const MidRound = ({
  party,
  user,
  lunchbox,
  getPartyInfo,
  skip,
  pickACard,
  guessed,
}) => {
  const { partyId, clueGiverId } = useParams();
  const { pathname } = useLocation();
  //to hide the button when the Start Round button is clicked
  const [isActive, setIsActive] = useState(false);
  const classes = useStyles();
  
  useEffect(() => {
    getPartyInfo(partyId, user.id, pathname);
  }, []);

  let currentCard = lunchbox.filter((card) => card.status === 'current')[0];
  if (!currentCard) {
    currentCard = lunchbox.filter((card) => card.status === 'skipped')[0];
  }
  const handleToggle = () => {
    setActive(true);
  }

  //to access the ref from the Video compnent
  const childRef = useRef();
  
  //Function to capture and autoclick on Join button on page load
  useEffect(() => {
    const clickedButton = document.getElementById('buttonClicked');
    clickedButton.click();
  }, [])
  
  return (
    <Box className={classes.playOuter}  mr={6} ml={6}>
       <Grid container spacing={2}>
          <Grid container item xs={6} md={4} className={classes.colLeft}>
            <Box className={classes.gameScreen}>
              <VideoCall ref={childRef}/>
            </Box>
          </Grid>
          <Grid container item xs={6} md={4} className={classes.colCenter}>
            <Box className={classes.countDown}>  
              <div style={{textAlign: 'center'}}>
                {currentCard && <h1><span className="accentYellow center">{currentCard.name}</span></h1>}
                <div>
                  <CountdownClock
                    isActive={isActive}
                    setIsActive={setIsActive}
                    currentCard={currentCard}
                  />
                </div>
              </div>
              <Button
                color="primary"
                variant="contained"
                size="large"
                onClick={() => {
                    pickACard(lunchbox);
                    handleToggle()
                  }
                }
                className={`${isActive ? "displayNone" : ""}`}
              >
                START ROUND
              </Button>
              <button onClick={() => guessed(currentCard, user, lunchbox)}>
                CHECK
              </button>
              <button onClick={() => skip(currentCard, lunchbox)}>SKIP</button>
            </Box>
          </Grid>
          <Grid container item xs={6} md={4} className={classes.colRight}>
            {/* <Box className={classes.gameScreen}>
              <VideoCall ref={childRef}/>
            </Box> */}
          </Grid>
      </Grid>  
    </Box>
  );
};

const mapState = ({ party, auth, lunchbox }) => {
  return {
    party: party || {},
    user: auth,
    lunchbox: lunchbox || [],
  };
};

const mapDispatch = (dispatch, { history }) => {
  return {
    getPartyInfo: (partyId, userId, path) => {
      dispatch(getPartyInfo(partyId, userId, path, history));
    },
    pickACard: (cards) => {
      dispatch(pickACard(cards));
    },
    guessed: (card, userId, lunchbox) => {
      dispatch(guessed(card, userId, lunchbox));
    },
    skip: (card, lunchbox) => {
      dispatch(skip(card, lunchbox));
    },
  };
};
export default connect(mapState, mapDispatch)(MidRound);
