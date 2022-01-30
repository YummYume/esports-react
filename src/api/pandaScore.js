import axios from 'axios';

export const pandaScoreQuery = () => {
    return axios.create({
        baseURL: 'https://api.pandascore.co/',
        params: {
            token: process.env.REACT_APP_PANDASCORE_API_TOKEN
        }
    });
};

export const getAllAvailableGames = () => {
    return [
        {
            name: 'Dota 2',
            slug: 'dota2',
        },
        {
            name: 'League of Legends',
            slug: 'lol',
        },
        {
            name: 'Counter-Strike: Global Offensive',
            slug: 'csgo',
        },
        {
            name: 'Overwatch',
            slug: 'ow',
        },
        {
            name: 'Rainbow 6 Siege',
            slug: 'r6siege',
        },
    ];
};

export const isValidGame = (gameSlug) => {
    return getAllAvailableGames().some((currentGame) => { return gameSlug === currentGame.slug });
}

export const getGameNameBySlug = (gameSlug) => {
    const game = getAllAvailableGames().find(gameData => gameData.slug === gameSlug);

    return game ? game.name : '';
}

export const getGameLeagues = async (game = null, page = null, perPage = null) => {
    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50
    };
    let queryString = 'leagues';
    let leagues = null;

    if (isValidGame(game)) {
        queryString = `${game}/leagues`;
    }

    await pandaScoreQuery().get(queryString, { params: params }).then((data) => {
        leagues = data;
    }).catch((error) => {
        console.error(`Error during getGameLeagues with game ${game} : ${error.message}`);
    });

    return leagues;
}

export const getGamePlayers = async (game = null, page = null, perPage = null) => {
    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50
    };
    let queryString = 'players';
    let players = null;

    if (isValidGame(game)) {
        queryString = `${game}/players`;
    }

    await pandaScoreQuery().get(queryString, { params: params }).then((data) => {
        players = data;
    }).catch((error) => {
        console.error(`Error during getGamePlayers with game ${game} : ${error.message}`);
    });

    return players;
}

export const getGameTeams = async (game = null, page = null, perPage = null) => {
    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50
    };
    let queryString = 'teams';
    let teams = null;

    if (isValidGame(game)) {
        queryString = `${game}/teams`;
    }

    await pandaScoreQuery().get(queryString, { params: params }).then((data) => {
        teams = data;
    }).catch((error) => {
        console.error(`Error during getGameTeams with game ${game} : ${error.message}`);
    });

    return teams;
}

export const getGameMatches = async (game = null, page = null, perPage = null) => {
    const endPoints = [
        'past',
        'running',
        'upcoming'
    ];
    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50
    };
    let queryString = 'matches';
    let matches = null;

    if (isValidGame(game)) {
        queryString = `${game}/matches`;
    }

    await axios.all(endPoints.map((endPoint) => pandaScoreQuery().get(`${queryString}/${endPoint}`, { params: params }).then((data) => {
        matches = data;
    }).catch((error) => {
        console.error(`Error during getGameMatches with game ${game} : ${error.message}`);
    })));

    return matches;
}