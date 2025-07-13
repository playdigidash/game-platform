// Stub for @lidvizion/commonlib
export const CurrEnvironment = { Production: 'production', Development: 'development' };
export const MongoDB = ({ children }: any) => { console.warn('Stub MongoDB used. Use cloud version for full functionality.'); return children; };
export const RealmApp = ({ children }: any) => { console.warn('Stub RealmApp used. Use cloud version for full functionality.'); return children; };
export const createCustomTheme = () => { throw new Error('Stub: createCustomTheme. Use cloud version.'); };
export const darkModeTheme = {};
export const AppRoute = {};
export const DefaultErrorHandleModal = () => null;
export const IUserProfileType = {};
export const LoginLvl = {};
export const waitForSpecifiedTime = async () => { throw new Error('Stub: waitForSpecifiedTime. Use cloud version.'); };
export const useMongoDB = () => ({});
export const useRealmApp = () => ({});
// Add more stubs as needed for your app to build. 