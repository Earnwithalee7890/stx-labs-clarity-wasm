# Clarity to WASM Compiler (stx-labs-clarity-wasm)

A powerful toolchain to compile **Clarity smart contracts** into **WebAssembly (WASM)**, enabling Clarity logic to run anywhere—browsers, Node.js, and other WASM runtimes.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6.svg)
![WASM](https://img.shields.io/badge/target-WebAssembly-654FF0.svg)

## 🌟 Features

- **Clarity Parsing**: Robust S-expression parser for Clarity syntax.
- **WASM Compilation**: Generates optimized WASM binaries using `binaryen`.
- **In-Browser Support**: fully functional compiler running in the browser (no backend required).
- **Stacks Wallet Integration**: Connect Xverse/Leather wallets directly in the playground.
- **Live Playground**: Immediate feedback loop—type Clarity, get WASM.

## 🚀 Quick Start

### CLI Usage

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Compile a Contract**
    ```bash
    npx ts-node src/index.ts contracts/math.clar output.wasm
    ```

3.  **Run Generated WASM**
    ```bash
    npx ts-node tests/run_wasm.ts output.wasm
    ```

### 🌐 Web Playground

Run the full web interface with wallet connection:

1.  **Navigate to UI**
    ```bash
    cd ui
    npm install
    ```

2.  **Start Dev Server**
    ```bash
    npm run dev
    ```

3.  Open `http://localhost:5173` to access the compiler playground.

## 🛠 Architecture

- **`src/parser.ts`**: Lexer (Moo) and AST generator. Handles Clarity S-expressions (`(+)`, `(define-data-var)`, etc.).
- **`src/compiler.ts`**: Traverses AST and emits Binaryen IR, which lowers to WebAssembly.
- **`ui/`**: Vite + React application. Uses `vite-plugin-node-polyfills` to run the compiler logic in the browser context.

## 🤝 Contributing

Contributions are welcome! Please submit a PR or open an issue.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 🏆 Talent Protocol Event

This project was built to demonstrate advanced Clarity tooling and Stacks integration.

**Key Highlights:**
- **Innovation**: Bringing Clarity to new runtime environments via WASM.
- **UX**: Seamless "Type & Run" experience in the browser.
- **Integration**: Native Stacks wallet support prepared for future mainnet deployments.

---

*Built with ❤️ by Stx Labs*
