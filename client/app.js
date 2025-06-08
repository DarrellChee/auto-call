const socket = io('http://localhost:3001');

function App() {
  const [status, setStatus] = React.useState('');
  const [lines, setLines] = React.useState([]);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [topic, setTopic] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [history, setHistory] = React.useState([]);
  const linesRef = React.useRef([]);

  React.useEffect(() => {
    socket.on('call-status', payload => {
      setStatus(payload.status);
      if (payload.status === 'completed') {
        setHistory(h => [...h, { topic, lines: linesRef.current }]);
        setLines([]);
      }
    });
    socket.on('transcript', payload => {
      setLines(lines => [...lines, payload]);
    });
  }, [topic]);

  React.useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/start-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, topic, userName })
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'started') {
        alert('Failed to start call');
      }
    } catch (err) {
      console.error(err);
      alert('Error starting call');
    }
  };

  return (
    React.createElement('div', { className: 'container' },
      React.createElement('h1', null, 'Auto Call'),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('input', {
          placeholder: 'Phone Number',
          value: phoneNumber,
          onChange: e => setPhoneNumber(e.target.value)
        }),
        React.createElement('input', {
          placeholder: 'Topic',
          value: topic,
          onChange: e => setTopic(e.target.value)
        }),
        React.createElement('input', {
          placeholder: 'Your Name',
          value: userName,
          onChange: e => setUserName(e.target.value)
        }),
        React.createElement('button', { type: 'submit' }, 'Start Call')
      ),
      React.createElement('div', { className: 'status' }, 'Call Status: ', status),
      React.createElement('div', { className: 'transcript' },
        lines.map((l, idx) =>
          React.createElement('div', { key: idx }, `${l.speaker}: ${l.text}`)
        )
      ),
      React.createElement('div', { className: 'call-history' },
        React.createElement('h3', null, 'Call History'),
        React.createElement('ul', null,
          history.map((item, idx) =>
            React.createElement('li', { key: idx },
              item.topic + ' - ' + item.lines.map(l => l.text).join(' ')
            )
          )
        )
      )
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
