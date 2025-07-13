import { getDashProfileByEmail, getGameProfileByEmail, IUserIdentity, IUserProfileType, updateUserIdentities } from '@lidvizion/commonlib';

export const checkIdentities = async ({
  db,
  email,
  currId
}:{
    currId: IUserIdentity,
    db:Realm.Services.MongoDBDatabase,
    email:string
}) => {
    updateUserIdentities({
      db,
      uid:currId.id,
      collection:'user_profile',
      currId,
      email
    })
    updateUserIdentities({
      db,
      uid:currId.id,
      collection:'user_game_profile',
      currId,
      email
    })
};
