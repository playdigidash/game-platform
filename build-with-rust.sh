#!/bin/bash

# Build the Rust WASM library first
echo "Building Rust WASM library..."
yarn nx run obstacle-pool-wasm:build

# Then build the game platform
echo "Building game platform..."
yarn nx build game-platform

echo "Build completed!" 