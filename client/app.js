const socket = io();

function App() {
  const [status, setStatus] = React.useState('');
  const [lines, setLines] = React.useState([]);

  React.useEffect(() => {
    socket.on('call-status', payload => {
      setStatus(payload.status);
    });
    socket.on('transcript', payload => {
      setLines(lines => [...lines, payload]);
    });
  }, []);

  return (
    React.createElement('div', null,
      React.createElement('h2', null, 'Call Status: ', status),
      React.createElement('ul', null,
        lines.map((l, idx) => React.createElement('li', { key: idx }, `${l.speaker}: ${l.text}`))
      )
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
