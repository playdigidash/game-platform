# API Reference

This section provides reference documentation for the various APIs and services used in the LVWebApp project.

## MongoDB Realm

The application uses MongoDB Realm for database operations. The key modules are located in:

- `libs/commonlib/src/lib/mongo/Mongo.ts`
- `libs/commonlib/src/lib/mongo/MongoQueries.ts`
- `libs/commonlib/src/lib/mongo/Realm.ts`

### Best Practices for MongoDB Realm

- Always `await` async database calls to prevent race conditions
- Wrap DB calls in try/catch blocks for proper error handling
- Avoid logging sensitive data

## Microsoft Translate API

The application integrates with Microsoft Translate API for translation services:

- `libs/commonlib/src/lib/ms-translate/msTranslate.ts`
- `libs/commonlib/src/lib/ms-translate/msTranslateRichText.ts`

## Google Services

The application uses various Google services:

- Google API for authentication
- Google Calendar API for calendar integration

## Search

The application includes search functionality:

- `libs/commonlib/src/lib/search/search.types.ts`

## Game & Module APIs

The application includes APIs for game and module functionality:

- `libs/commonlib/src/lib/commonmodels/GameModel.ts`
- `libs/commonlib/src/lib/commonmodels/Module.ts`
