import { useState } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import './App.css';
import { parse } from './compiler/parser';
import { compile } from './compiler/compiler';

// Initialize Stacks Session
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function App() {
  const [userData, setUserData] = useState<any>(undefined);
  const [clarityCode, setClarityCode] = useState('(+ 10 20)');
  const [wasmOutput, setWasmOutput] = useState<Uint8Array | null>(null);
  const [executionResult, setExecutionResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'Clarity WASM Compiler',
        icon: window.location.origin + '/vite.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        setUserData(userSession.loadUserData());
      },
      userSession: userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut("/");
    setUserData(undefined);
  };

  const handleCompile = async () => {
    setError('');
    setExecutionResult('');
    setWasmOutput(null);

    try {
      console.log("Compiling...", clarityCode);
      const ast = parse(clarityCode);
      console.log("AST:", ast);
      const wasm = compile(ast);
      setWasmOutput(wasm);

      // Try to execute it
      const wasmModule = await WebAssembly.instantiate(wasm);
      const instance = wasmModule.instance;
      const main = instance.exports.main as () => bigint;
      const result = main();
      setExecutionResult(result.toString());

    } catch (e: any) {
      console.error(e);
      setError(e.message || "Compilation failed");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Clarity to WASM</h1>
        <div className="wallet-connect">
          {!userSession.isUserSignedIn() ? (
            <button onClick={connectWallet}>Connect Stacks Wallet</button>
          ) : (
            <button onClick={disconnectWallet}>Disconnect {userData?.profile?.stxAddress?.testnet}</button>
          )}
        </div>
      </header>

      <main>
        <section className="editor">
          <h2>Clarity Input</h2>
          <textarea
            value={clarityCode}
            onChange={(e) => setClarityCode(e.target.value)}
            rows={10}
            cols={80}
          />
          <button onClick={handleCompile}>Compile to WASM</button>
        </section>

        <section className="output">
          <h2>WASM Output</h2>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          {wasmOutput && (
            <div className="wasm-result">
              <p>Size: {wasmOutput.length} bytes</p>
              <pre>{Array.from(wasmOutput).map(b => b.toString(16).padStart(2, '0')).join(' ')}</pre>
            </div>
          )}
          <h2>Execution Result</h2>
          <pre>{executionResult}</pre>
        </section>
      </main>
    </div>
  );
}

export default App;
