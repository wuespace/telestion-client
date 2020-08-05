import React, { useState, useEffect } from 'react';
import { Provider, defaultTheme, Button } from '@adobe/react-spectrum';
// import io from 'socket.io-client';

export default function App() {
  /* const [myData, setMyData] = useState<any>(null);

  useEffect(() => {
    const connection = io.connect('https://localhost:4551');
    connection.on('eventName', (data: any) => {
      setMyData(data);
    })

    return () => {
      connection.close();
    };
  }, []); */

  return (
    <Provider theme={defaultTheme}>
      <Button variant="cta" onPress={() => alert('Hey there')}>
        Hello React Spectrum!
      </Button>
    </Provider>
  )
}
