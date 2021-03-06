const router = require('express').Router();
// const {
//   models: { User, Party, Lunchbox, Game, Card, Team },
// } = require('../db');

const User = require('../db/models/User');
const Party = require('../db/models/Party');
const Lunchbox = require('../db/models/Lunchbox');
const Game = require('../db/models/Game');
const Card = require('../db/models/Card');
const Team = require('../db/models/Team');

module.exports = router;

//CREATE A PARTY AND ADD HOST
router.post('/host', async (req, res, next) => {
  try {
    const party = await Party.create();
    await party.update({ currentRoute: `/party/${party.id}` });
    const host = await User.findByPk(req.body.hostId);
    await host.update({ partyId: party.id, host: party.id });
    await party.chooseGame('lunchbox');
    res.json(party);
  } catch (err) {
    next(err);
  }
});

//GET PARTY INFO

router.get('/:id', async (req, res, next) => {
  const party = await Party.findOne({
    where: { id: req.params.id },
    include: [
      { model: User },
      {
        model: Game,
        include: { model: Lunchbox, include: { model: Card } },
      },
      {
        model: Team,
        include: { model: User },
      },
    ],
  });

  res.json(party);
});

//MAKE TEAMS

router.post('/teams/:id', async (req, res, next) => {
  try {
    const party = await Party.findByPk(req.params.id);
    const users = await User.findAll({ where: { partyId: party.id } });
    const teamSize = users.length / 2;
    const teamA = await Team.create({ partyId: party.id });
    const teamB = await Team.create({ partyId: party.id });

    for (let i = 0; i < teamSize; i++) {
      const idx = Math.floor(Math.random() * users.length);
      await users[idx].update({ teamId: teamB.id, turnOrder: i + 1 });
      users.splice(idx, 1);
    }

    for (let i = 0; i < users.length; i++) {
      await users[i].update({ teamId: teamA.id, turnOrder: i + 1 });
    }

    const guesser = await User.findOne({
      where: { partyId: party.id, teamId: teamB.id, turnOrder: 1 },
    });

    await party.update({
      guessingTeam: teamA.id,
      currentRoute: `/dummyround/${party.id}/${guesser.id}`,
    });
    res.json(guesser);
  } catch (err) {
    next(err);
  }
});

//JOIN A PARTY ROUTE
router.post('/join/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.body.id * 1);

    const join = { partyId: req.params.id, host: null };

    if (user.host === req.params.id) {
      join.host = req.params.id;
    }

    await user.update(join);
  } catch (err) {
    next(err);
  }
});

//GET PARTY GAME STATE ROUTE
