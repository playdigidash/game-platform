# LVWebApp Documentation

Welcome to the official documentation for the LVWebApp project. This documentation provides information about the architecture, components, and usage of the application.

## Overview

LVWebApp is a React application built with Nx workspace that provides a comprehensive solution for digital experiences. This documentation will help you understand how to work with and extend the application.

## Quick Links

- [Installation Guide](getting-started/installation.md)
- [Configuration](getting-started/configuration.md)
- [Components Overview](components/overview.md)
- [API Reference](api/overview.md)

## Project Structure

The project follows a monorepo structure using Nx with multiple apps and shared libraries:

```
lvwebapp-mono-repo/
├── apps/           # Application code
├── libs/           # Shared libraries
│   └── commonlib/  # Common models and utilities
├── tools/          # Build and configuration tools
└── docs/           # Documentation (this site)
```
