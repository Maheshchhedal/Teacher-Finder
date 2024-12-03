import React from 'react';

function Empty({ image, title, subtitle }) {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 my-3 rounded-lg" style={{ height: '85vh' }}>
      <img src={image} alt="Empty State" className="w-24 h-24" />
      <h1 className="m-3 text-3xl font-semibold">{title}</h1>
      <h5 className="text-lg text-gray-700">{subtitle}</h5>
    </div>
  );
}

export default Empty;
