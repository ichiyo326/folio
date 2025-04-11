import React from 'react';

type BigHeadingProps = {
  text: string;
};

function BigHeading({ text }: BigHeadingProps) {
  return (
    <h2
      style={{
        fontSize: '3rem',
        textAlign: 'center',
        marginTop: '2rem',
        marginBottom: '2rem'
      }}
    >
      {text}
    </h2>
  );
}

export default BigHeading;
