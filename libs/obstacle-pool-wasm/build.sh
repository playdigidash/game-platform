#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../../" && pwd)"

# Change to the script directory
cd "$SCRIPT_DIR" || {
  echo "Failed to change to script directory"
  exit 1
}

# Ensure Rust and wasm-pack are installed
if ! command -v rustc &> /dev/null; then
  echo "Error: Rust is not installed. Please install Rust from https://rustup.rs/"
  exit 1
fi

if ! command -v wasm-pack &> /dev/null; then
  echo "Error: wasm-pack is not installed. Installing it now..."
  cargo install wasm-pack || {
    echo "Failed to install wasm-pack. Please install it manually."
    exit 1
  }
fi

# Build the Rust WASM library
echo "Building Rust WASM library..."
echo "Current directory: $(pwd)"
echo "Listing directory contents:"
ls -la

wasm-pack build --target web --out-dir pkg || {
  echo "Failed to build WASM package"
  exit 1
}

# Create the TypeScript distribution
echo "Building TypeScript distribution..."
mkdir -p dist

# Use absolute path to TypeScript
TSC_PATH="$WORKSPACE_ROOT/node_modules/.bin/tsc"
if [ ! -f "$TSC_PATH" ]; then
  echo "Error: TypeScript compiler not found at $TSC_PATH"
  exit 1
fi

"$TSC_PATH" || {
  echo "Failed to compile TypeScript. Check for errors."
  exit 1
}

# Copy compiled pkg files to dist
cp -r pkg/*.js dist/
cp -r pkg/*.wasm dist/
cp -r pkg/*.ts dist/ 2>/dev/null || true # Copy .ts files if they exist

# Ensure the WASM file is properly copied
if [ ! -f "dist/obstacle_pool_wasm_bg.wasm" ]; then
  echo "Error: WASM file not found in dist directory"
  exit 1
fi

echo "Build completed successfully!" 