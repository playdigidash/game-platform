# Installation

This guide will help you set up your development environment for working with the LVWebApp project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 20.x or later)
- Yarn package manager
- Git

## Clone the Repository

```bash
git clone <repository-url>
cd lvwebapp-mono-repo
```

## Install Dependencies

Install all required dependencies using Yarn:

```bash
yarn
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
NX_GOOGLE_API_CLIENT_ID=your_google_api_client_id
NX_GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key
NX_MS_TRANSLATE_API_KEY=your_ms_translate_api_key
NX_MS_TRANSLATE_SERVER_REGION=your_ms_translate_server_region
NX_DB=your_db_connection_string
NX_DEFAULT_ORG_ID=your_default_org_id
```

## Starting the Development Server

Start the development server with:

```bash
yarn start
```

This will start the application at http://localhost:4200.
