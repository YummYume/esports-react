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

export const getGameLeagues = async (game = null) => {
    let queryString = 'leagues';

    if (getAllAvailableGames().some((currentGame) => { return game === currentGame.slug })) {
        queryString = `${game}/leagues`;
    }

    const leagues = await pandaScoreQuery().get(queryString).catch((error) => {
        console.error(`Error during getGameLeagues with game ${game} : ${error.message}`);
        return {};
    });

    return leagues;
}
