import React from 'react';
import { useSpring, animated } from 'react-spring';

const UserCoins = ({user}) => {
    const { coins } = useSpring({
        from: { number: 0 },
        coins: user.coins,
        delay: 200,
    });

    return (
        <span>
            {user.username} (<animated.span>
                {coins.to(n => n.toFixed(0))}
            </animated.span> jeton{user.coins > 1 ? 's' : ''})
        </span>
    );
};

export default UserCoins;
