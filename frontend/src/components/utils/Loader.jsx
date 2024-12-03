import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

function Loader({ loading }) {
    const override = {
        display: 'block',
        margin: '0 auto',
        borderColor: 'red',
    };

    return (
        <div className={`fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center ${loading ? 'block' : 'hidden'}`}>
            <BeatLoader
                color="#3459e6"
                loading={loading}
                cssOverride={override}
                size={20}
                aria-label="BeatLoader"
                data-testid="loader"
            />
        </div>
    );
}

export default Loader;
