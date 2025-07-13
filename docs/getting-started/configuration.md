# Configuration

This guide covers the configuration options for the LVWebApp project.

## Environment Variables

The application uses environment variables for configuration. These can be set in a `.env` file in the root directory.

| Variable                        | Description                                       | Required |
| ------------------------------- | ------------------------------------------------- | -------- |
| `NX_GOOGLE_API_CLIENT_ID`       | Google API Client ID for authentication           | Yes      |
| `NX_GOOGLE_CALENDAR_API_KEY`    | Google Calendar API Key                           | Yes      |
| `NX_MS_TRANSLATE_API_KEY`       | Microsoft Translate API Key                       | Yes      |
| `NX_MS_TRANSLATE_SERVER_REGION` | Microsoft Translate Server Region                 | Yes      |
| `NX_DB`                         | Database connection string                        | Yes      |
| `NX_DEFAULT_ORG_ID`             | Default organization ID                           | Yes      |
| `NX_LV_THEME`                   | UI Theme ('dark' or 'light', defaults to 'light') | No       |

## UI Theme

The application supports both dark and light themes. The theme can be controlled through the `NX_LV_THEME` environment variable:

```
NX_LV_THEME=dark  # For dark theme
NX_LV_THEME=light # For light theme (default)
```

## Build Configuration

The project uses Nx for build configuration. You can customize build options in the `workspace.json` and `nx.json` files.

### Production Builds

For production builds, use the `--prod` flag:

```bash
nx build my-app --prod
```
