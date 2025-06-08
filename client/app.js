const socket = io('http://localhost:3001');
      const res = await fetch('http://localhost:3001/start-call', {
import io from 'socket.io-client';
import './index.css';

const socket = io();

function App() {
  const [status, setStatus] = useState('');
  const [lines, setLines] = useState([]);
  const [history, setHistory] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [topic, setTopic] = useState('');
  const [userName, setUserName] = useState('');
  const linesRef = useRef([]);

  // Keep linesRef in sync
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  // Socket listeners
  useEffect(() => {
    const onStatus = payload => {
      setStatus(payload.status);
      if (payload.status === 'completed') {
        // Save call record
        setHistory(prev => [
          ...prev,
          { topic, lines: linesRef.current }
        ]);
        setLines([]);
      }
    };
    const onTranscript = payload => {
      setLines(prev => [...prev, payload]);
    };

    socket.on('call-status', onStatus);
    socket.on('transcript', onTranscript);

    return () => {
      socket.off('call-status', onStatus);
      socket.off('transcript', onTranscript);
    };
  }, [topic]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/start-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, topic, userName })
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'started') {
        throw new Error('Failed to start call');
      }
    } catch (err) {
      console.error(err);
      alert('Error starting call');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Auto Call</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Topic"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Your Name"
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Start Call
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl">Call Status: <span className="font-medium">{status}</span></h2>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Live Transcript</h3>
        <ul className="space-y-1">
          {lines.map((l, idx) => (
            <li key={idx} className="border-b pb-1">
              <strong>{l.speaker}:</strong> {l.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Call History</h3>
        <ul className="space-y-1">
          {history.map((item, idx) => (
            <li key={idx} className="border p-2 rounded">
              <strong>{item.topic}</strong>: {item.lines.map(l => l.text).join(' ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
