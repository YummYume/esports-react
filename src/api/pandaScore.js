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
        {
            name: 'Valorant',
            slug: 'valorant',
        },
        {
            name: 'Rocket League',
            slug: 'rl',
        },
        {
            name: 'Fifa',
            slug: 'fifa',
        },
        {
            name: 'LoL Wild Rift',
            slug: 'lol-wild-rift',
        }
    ];
};

export const getHeroesItemsAvailableGames = () => {
    return [
        {
            name: 'Dota 2',
            slug: 'dota2',
            url: 'heroes',
        },
        {
            name: 'League of Legends',
            slug: 'lol',
            url: 'champions',
        }
    ];
};

export const isValidGame = (gameSlug, heroesItemsOnly = false) => {
    if (heroesItemsOnly) {
        return getHeroesItemsAvailableGames().some((currentGame) => { return gameSlug === currentGame.slug });
    }

    return getAllAvailableGames().some((currentGame) => { return gameSlug === currentGame.slug });
};

export const getGameNameBySlug = (gameSlug, heroesItemsOnly = false) => {
    let game;

    if (heroesItemsOnly) {
        game = getHeroesItemsAvailableGames().find(gameData => gameData.slug === gameSlug);
    } else {
        game = getAllAvailableGames().find(gameData => gameData.slug === gameSlug);
    }

    return game ? game.name : '';
};

export const getGameUrlBySlug = (gameSlug) => {
    const game = getHeroesItemsAvailableGames().find(gameData => gameData.slug === gameSlug);

    return game ? game.url : '';
};

export const getGameLeagues = async (game = null, page = null, perPage = null, search = null) => {
    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50,
        'search[name]': search ?? '',
    };
    const queryString = isValidGame(game) ? `${game}/leagues` : 'leagues';
    let leagues = null;

    await pandaScoreQuery().get(queryString, { params: params }).then((data) => {
        leagues = data;
    }).catch((error) => {
        console.error(`Error during getGameLeagues with game ${game} : ${error.message}`);
    });

    return leagues;
}

export const getGamePlayers = async (game = null, page = null, perPage = null, search = null) => {
    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50,
        'search[name]': search ?? '',
    };
    const queryString = isValidGame(game) ? `${game}/players` : 'players';
    let players = null;

    await pandaScoreQuery().get(queryString, { params: params }).then((data) => {
        players = data;
    }).catch((error) => {
        console.error(`Error during getGamePlayers with game ${game} : ${error.message}`);
    });

    return players;
};

export const getGameTeams = async (game = null, page = null, perPage = null, search = null) => {
    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50,
        'search[name]': search ?? '',
    };
    const queryString = isValidGame(game) ? `${game}/teams` : 'teams';
    let teams = null;

    await pandaScoreQuery().get(queryString, { params: params }).then((data) => {
        teams = data;
    }).catch((error) => {
        console.error(`Error during getGameTeams with game ${game} : ${error.message}`);
    });

    return teams;
};

export const getGameMatches = async (endPoint, game = null, page = null, perPage = null, search = null) => {
    const endPoints = [
        'past',
        'running',
        'upcoming',
    ];

    if (!endPoints.includes(endPoint)) {
        return {};
    }

    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50,
        'search[name]': search ?? '',
    };
    const queryString = isValidGame(game) ? `${game}/matches` : 'matches';
    let matches = null;

    await pandaScoreQuery().get(`${queryString}/${endPoint}`, { params: params }).then((data) => {
        matches = data;
    }).catch((error) => {
        console.error(`Error during getGameMatches with game ${game} and endPoint ${endPoint} : ${error.message}`);
    });

    return matches;
};

export const getLeagueMatches = async (endPoint, league = null, page = null, perPage = null, search = null) => {
    const endPoints = [
        'past',
        'running',
        'upcoming',
    ];

    if (!endPoints.includes(endPoint)) {
        return [];
    }

    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50,
        'search[name]': search ?? '',
    };
    const queryString = `leagues/${league}/matches/${endPoint}`;
    let matches = null;

    await pandaScoreQuery().get(`${queryString}`, { params: params }).then((data) => {
        matches = data;
    }).catch((error) => {
        console.error(`Error during getLeagueMatches with league ${league} and endPoint ${endPoint} : ${error.message}`);
    });

    return matches;
};

export const getGameHeroes = async (game = null, page = null, perPage = null) => {
    if (!isValidGame(game, true)) {
        return [];
    }

    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50
    };
    const queryString = `${game}/${getGameUrlBySlug(game)}`;
    let heroes = null;

    await pandaScoreQuery().get(queryString, { params: params }).then((data) => {
        heroes = data;
    }).catch((error) => {
        console.error(`Error during getGameHeroes with game ${game} : ${error.message}`);
    });

    return heroes;
};

export const getGameItems = async (game = null, page = null, perPage = null) => {
    const params = {
        page: page ?? 1,
        per_page: perPage ?? 50
    };
    const queryString = isValidGame(game, true) ? `${game}/items` : 'items';
    let items = null;

    await pandaScoreQuery().get(queryString, { params: params }).then((data) => {
        items = data;
    }).catch((error) => {
        console.error(`Error during getGameItems with game ${game} : ${error.message}`);
    });

    return items;
};

export const getMatch = async (matchId) => {
    let match = null;

    await pandaScoreQuery().get(`matches/${matchId}`).then((data) => {
        match = data;
    }).catch((error) => {
        console.error(`Error during getMatch with matchId ${matchId} : ${error.message}`);
    });

    return match;
};

export const getLeague = async (leagueId) => {
    let league = null;

    await pandaScoreQuery().get(`leagues/${leagueId}`).then((data) => {
        league = data.data;
    }).catch((error) => {
        console.error(`Error during getLeague with leagueId ${leagueId} : ${error.message}`);
    });

    return league;
};
