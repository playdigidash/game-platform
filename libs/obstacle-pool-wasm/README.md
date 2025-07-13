# Obstacle Pool WASM

A Rust-powered WebAssembly (WASM) implementation of the Obstacle Pool for improved performance in the game platform.

## Overview

This library uses Rust and WebAssembly to implement a high-performance object pooling system for 3D obstacles in the game platform. The goal is to reduce lag and improve performance by moving the object management logic from JavaScript to Rust.

## Features

- Fast object pooling mechanism written in Rust
- Memory-efficient object management
- Reduced garbage collection pressure
- Easy integration with existing TypeScript/JavaScript code
- Fallback to JavaScript implementation if WASM fails to load

## Prerequisites

- [Rust](https://rustup.rs/)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- Node.js and Yarn

## Development

1. Install Rust and wasm-pack if not already installed:

   ```
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```

2. Build the library:

   ```
   cd libs/obstacle-pool-wasm
   ./build.sh
   ```

3. Integration with game-platform:
   The game platform code has been updated to automatically use this library when available.

## How It Works

The library provides a Rust implementation of object pooling with JavaScript/TypeScript bindings. It handles the creation, recycling, and management of 3D obstacles in the game, improving performance by:

1. Reducing garbage collection pauses
2. Utilizing Rust's efficient memory management
3. Moving performance-critical operations to compiled WASM code

## Usage

The library is used automatically by the ObstaclesViewStore if available. It will fall back to the original JavaScript implementation if WASM cannot be loaded.

## Troubleshooting

If you encounter issues:

1. Make sure Rust and wasm-pack are properly installed
2. Check the browser console for errors
3. Try rebuilding the library with `./build.sh`
4. If still experiencing issues, the code will automatically fall back to the JavaScript implementation
