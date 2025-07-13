import { BSON } from 'realm-web';
import { ObjectId } from 'bson';
import {
  IDashboardUserModel,
  ICurrentUserModel,
  IGameUserModel,
  IGameUserModelFromDb,
  IUserIdentity,
  IUserOrgRelation,
  IUserProfileType,
  IOnboardingPhase,
  IOnboardingStep,
  IUnivOrg,
  OnboardingPhaseName,
  IUsagePercentages,
} from '../commonmodels/CurrentUserModel';
import axios from 'axios';
import {
  ICurrentMaterial,
  ICustomMaterialItem,
  IScannedImgDataModel,
} from '../commonmodels/MaterialModel';
import {
  IAppSettings,
  ISliderImagesModel,
  ISliderSettings,
  SingleSlideModel,
} from '../commonmodels/SingleSliderModel';
import { CalendarEventModel } from '../commonmodels/CalendarModel';
import { IImgType } from '../commonmodels/Constants';
import { ILocation } from '../commonmodels/LocationModel';
import { RecycleSearchOotionModel } from '../commonmodels/SearchOptionModel';
import { v4 as uuidv4 } from 'uuid';
import { isArray, uniqBy } from 'lodash';
import { IGameSession, IQuestData } from '../commonmodels/GameModel';
import {
  DefaultOrCustom,
  IDbQuestion,
  IHint,
  ISingleQuestionModel,
  IGlb,
  GLBType,
  ICustomModule,
  IGlbObjectKey,
  IImage,
  IHeroTemplate,
  TriviaGenDetails,
  ImageGenDetails,
  QuickCreateDetails,
  threeDGenDetails,
  IFile,
  ITheme,
  IAIGen,
  ESponsorContentType,
  ISponsorEntry,
  ICustomModuleFromDb,
} from '../commonmodels/Module';
import { toBase64 } from '../common';
import { environmentConfig } from '../config/EnvironmentConfig';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { IPageModel } from '../commonmodels/CurrentCustomerModel';
import { xformedUtils, xformedSource } from '../common';
import moment from 'moment';
import { nameGenerator, removeBadWords } from '../common';
import { LoginType } from '../commonmodels/Constants';
import { ProviderType } from 'realm-web';
import { IGameProfile } from '../commonmodels/GameModel';

// Helper function to get AWS API URL with proper error handling
const getAwsApiUrl = (endpoint: string): string | null => {
  const awsConfig = environmentConfig.getAwsConfig();
  if (!awsConfig) {
    console.warn('AWS configuration not available. API calls are only available in the cloud version.');
    return null;
  }
  return `https://${awsConfig.gatewayCode}.execute-api.us-east-1.amazonaws.com/production/${endpoint}`;
};

// Helper function to get bucket name with fallback
const getBucketName = (customBucket?: string): string | null => {
  const awsConfig = environmentConfig.getAwsConfig();
  if (!awsConfig) {
    console.warn('AWS configuration not available. Bucket operations are only available in the cloud version.');
    return null;
  }
  return customBucket || awsConfig.avatarBucket;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ICurrentLocation {}
export interface ISubcribeModel {
  protocol: string;
  endpoint: string;
}

interface ISelect3DMod {
  [key: string]: any;
}

export const getUserProfile = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
) => {
  try {
    return await db.collection(`user_profile`).findOne({
      uid,
    });
  } catch (error) {
    return error;
  }
};

export const updateUserProfile = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string,
  updates: any
) => {
  try {
    const result = await db.collection(`user_profile`).updateOne(
      {
        uid,
      },
      {
        $set: updates,
      }
    );
    return result;
  } catch (error) {
    return error;
  }
};

export const updateUserIdentities = async ({
  db,
  email,
  collection,
  uid,
  currId,
}: {
  db: Realm.Services.MongoDBDatabase;
  email: string;
  collection: string;
  uid: string;
  currId: IUserIdentity;
}) => {
  try {
    return await db.collection(collection).updateOne(
      {
        email,
        'identities.id': { $ne: uid },
      },
      {
        $addToSet: { identities: currId },
      }
    );
  } catch (error) {
    return error;
  }
};

export const getUserProfileByUsername = async (
  db: Realm.Services.MongoDBDatabase,
  email: string
) => {
  try {
    if (db && db.collection) {
      const profile = await db.collection(`user_profile`).findOne(
        {
          $or: [
            {
              username: {
                $eq: `${email}`,
              },
            },
          ],
        },
        { projection: { username: 1 } }
      );

      return profile;
    }
  } catch (error) {
    return error;
  }
};

export const fetchUsageData = async (
  db: Realm.Services.MongoDBDatabase,
  userId: string
) => {
  if (db && db.collection) {
    try {
      const res = await db.collection('usage').findOne({ uid: userId });
      return res;
    } catch (error) {
      console.error('Error fetching usage data:', error);
      throw error;
    }
  } else {
    console.error('Invalid database object');
    return null;
  }
};

export const fetchModuleUsage = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
) => {
  if (db && db.collection) {
    try {
      // Fetch the usage data for the given user
      const usageData = await db.collection('usage').findOne({ uid: uid });
      if (!usageData || !usageData.playsByModule) {
        console.error('No playsByModule data found.');
        return;
      }
      // Extract module IDs and play counts
      const playsByModule = usageData.playsByModule;
      const moduleIds = Object.keys(playsByModule);

      if (moduleIds.length === 0) {
        return;
      }

      // Fetch modules from default_modules collection using the module IDs
      const modulesData = await db
        .collection('default_modules')
        .find({ moduleId: { $in: moduleIds } });

      // Build the modules array to be returned
      const modules = modulesData.map((moduleDoc: any) => {
        const moduleId = moduleDoc.moduleId;
        return {
          id: moduleId,
          name: moduleDoc.settings?.gTitle || 'Untitled Module',
          totalPlays: playsByModule[moduleId] || 0,
        };
      });

      return modules; // Return the modules array
    } catch (error) {
      console.error('Error fetching module usage data:', error);
      return []; // Return an empty array on error
    }
  } else {
    console.error('Invalid database object');
    return []; // Return an empty array if db object is invalid
  }
};

export const getThemeData = async (
  db: Realm.Services.MongoDBDatabase,
  themeId: string
) => {
  if (db && db.collection) {
    try {
      const res = await db.collection('theme').findOne({ themeId: themeId });
      return res;
    } catch (error) {
      console.error('Error fetching usage data:', error);
      throw error;
    }
  } else {
    console.error('Invalid database object');
    return null;
  }
};

export const getNearbyLocs = async (db: any, currLoc: ICurrentLocation) => {
  // debugger
  // collection.createIndex({location:"2dsphere"})
  return await db.collection(`recycling_locs`).find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [-81.92355400740252, 28.03097516548589],
          // "coordinates":[currLoc.coords.longitude, currLoc.coords.latitude]
        },
        $maxDistance: 30000,
      },
    },
    // $text: {
    //     "$search": {
    //         "near": {
    //             "origin": {
    //                 "type": "Point",
    //                 "coordinates": [-81.92355400740252, 28.03097516548589]
    //             },
    //             "pivot": 30000,
    //             "path": "location.coordinates"
    //         }
    //     }
    // }
  });
};

// export const getMaterialsFromAccepted = async(
//   db:Realm.Services.MongoDBDatabase,
//   acceptedMats:IAcceptedMaterial[]
//   )=>{
//     let mats:ICurrentMaterial[] = []
//   try {
//     if (db && db.collection && acceptedMats.length > 0) {
//       const res = await db.collection(`material`).find({
//         $or:acceptedMats.map(m=>{
//           return {
//             type: m.materialType
//           }
//         })
//       })

//       mats = res.map(r=>{
//         return {
//           item: r.item,
//           isNearby: false,
//           type: r.type,
//           dos: [],
//           donts: [],
//           svg: r.svg,
//           labelmap: r.labelmap || {},
//           fixable: [],
//           id: r.id,
//           funFacts: [],
//           _partition: 'materials',
//           dropLocation: '',
//           stream: {
//             isBulk:false,
//             isDropoff:false,
//             isRecycling:false,
//             isYard:false
//           }
//         }
//       })

//       return mats
//     }
//   } catch (error) {
//      console.log(error)
//   }

//   return mats;
// }
export const getDefaultMatById = async (
  db: Realm.Services.MongoDBDatabase,
  itemId: string
) => {
  try {
    if (db && db.collection) {
      const mat = await db.collection(`default_material_items`).findOne({
        'item.itemId': itemId,
      });

      return mat;
    }
  } catch (error) {
    return error;
  }
};

export const getCurrentLabelId = async (
  db: Realm.Services.MongoDBDatabase,
  orgId: string
) => {
  try {
    if (db && db.collection) {
      const res = await db.collection(`organization`).findOne({
        id: orgId,
      });

      return res?.dashboardSettings?.labelId || '';
    }
  } catch (error) {
    return error;
  }
};

export const getAcceptedMaterials = async (
  db: Realm.Services.MongoDBDatabase,
  customerId: string
) => {
  try {
    if (db && db.collection) {
      const mats = await db.collection(`accepted_material`).find({
        customerId,
      });

      return mats;
    }
  } catch (error) {
    return error;
  }

  return null;
};

// ****************************
// â†“ new search query functions
// ****************************

export const getCustomMaterials = async (
  db: Realm.Services.MongoDBDatabase,
  organizationId: string
): Promise<ICustomMaterialItem[]> => {
  try {
    if (db) {
      const dbMats: ICustomMaterialItem[] = await db
        .collection('customer_material_items')
        .find({
          organizationId,
        });

      return dbMats;
    }

    return [];
  } catch (error: any) {
    console.error('error: ', error);
    return error;
  }
};

//TODO:performance through aggregation
export const getAllMaterialData = async (
  db: Realm.Services.MongoDBDatabase,
  organizationId: string
) => {
  try {
    if (db && db.collection) {
      const allAcceptedMaterials: any = {};
      const queries = [];

      queries.push(async () => {
        const streams = await db.collection('customer_stream_types').findOne({
          organizationId,
        });

        return streams;
      });

      queries.push(async () => {
        let defItems = [];
        const customTypes = await db.collection('customer_types').findOne({
          organizationId,
        });

        const defItmIds: any[] = [];
        customTypes?.types?.forEach((type: any) => {
          if (type.defItems && type.defItems.length > 0) {
            defItmIds.push(...type.defItems);
          }
        });

        defItems = await db.collection('default_material_items').find({
          'item.itemId': { $in: defItmIds.map((idObj) => idObj.id) },
        });

        return {
          customTypes,
          defItems,
        };
      });

      queries.push(async () => {
        let defItems = [];
        const customItms = await db.collection('customer_material_items').find({
          organizationId,
        });

        if (customItms?.length > 0) {
          const defItmIds: string[] = [];
          customItms.forEach((i) => {
            if (i.item?.connectedItems) {
              defItmIds.push(...i.item.connectedItems);
            }
          });

          defItems = await db.collection('default_material_items').find({
            'item.itemId': { $in: defItmIds },
          });
        }

        return {
          customItms,
          defItems,
        };
      });

      const [streamSetup, cusTypes, allItems] = await Promise.all(
        queries.map((fn) => fn())
      );

      const allDefItms = uniqBy(
        [...allItems.defItems, ...cusTypes.defItems],
        'item.itemId'
      );

      if (streamSetup) {
        streamSetup?.streams?.forEach((stream: any) => {
          stream.id = uuidv4();
          const mappedTypes: any[] = [];
          stream.cusTypes.forEach((cusTypeId: any) => {
            const typeFound = cusTypes.customTypes.types.find((ct: any) => {
              return cusTypeId.id === ct.cusTypeId;
            });

            if (typeFound) {
              mappedTypes.push(typeFound);
            }
          });

          stream.mappedTypes = mappedTypes;
          mappedTypes.forEach((mappedType) => {
            const mappedItems: any[] = [];
            mappedType.cusItems?.forEach((custItemId: any) => {
              const foundItem = allItems.customItms.find((ci: any) => {
                return ci.id === custItemId.id;
              });

              if (foundItem) {
                const materialItm: ICurrentMaterial = {
                  item: foundItem.item.itemNameCusOvr || '',
                  id: foundItem.id,
                  dos: foundItem.dos || mappedType.dos || [],
                  donts: foundItem.donts || mappedType.donts || [],
                  dropLocations: [],
                  isAccepted:
                    foundItem.advanced?.isAccepted !== null
                      ? foundItem.advanced?.isAccepted
                      : true,
                  funFacts: foundItem.funFactsOvr || mappedType.funFacts || [],
                  labelmap: {
                    labelmaptxt: null,
                    id: null,
                  },
                  fixable: foundItem.fixable || mappedType.fixable || [],
                  type: {
                    id: mappedType.cusTypeId,
                    svgId: mappedType.typeCusSvgId || null,
                  },
                  doMain:
                    foundItem.doMsg || mappedType.doMsg || stream.doMsg || '',
                  dontsMain:
                    foundItem.dontMsg ||
                    mappedType.dontMsg ||
                    stream.dontMsg ||
                    '',
                  fixableMain:
                    foundItem.fixMsg ||
                    mappedType.fixMsg ||
                    stream.fixMsg ||
                    '',
                  stream: {
                    doSvgId: stream.streamCusSvgId || null,
                    dontSvgId: stream.streamCusSvgDontsId || null,
                    id: stream.id,
                  },
                  itemSvgId: foundItem.cusSvg?.svgId || null,
                };

                mappedItems.push(materialItm);
                allAcceptedMaterials[materialItm.id] = materialItm;
              }
            });

            mappedType.defItems?.forEach((defItems: any) => {
              const foundItem = allDefItms.find((ci: any) => {
                return ci.item.itemId === defItems.id;
              });

              if (foundItem) {
                const materialItm: ICurrentMaterial = {
                  item: foundItem.item.itemName || '',
                  id: foundItem.item.itemId,
                  dos: mappedType.dos || [],
                  donts: mappedType.donts || [],
                  dropLocations: [],
                  isAccepted: true,
                  funFacts: mappedType.funFacts || [],
                  labelmap: foundItem.labelmap || {
                    labelmapId: null,
                    labelmaptxt: null,
                  },
                  fixable: mappedType.fixable || [],
                  type: {
                    id: mappedType.cusTypeId,
                    svgId: mappedType.typeCusSvgId || null,
                  },
                  doMain: mappedType.doMsg || stream.doMsg || '',
                  dontsMain: mappedType.dontMsg || stream.dontMsg || '',
                  fixableMain: mappedType.fixMsg || stream.fixMsg || '',
                  stream: {
                    doSvgId: stream.streamCusSvgId || null,
                    dontSvgId: stream.streamCusSvgDontsId || null,
                    id: stream.id,
                  },
                  itemSvgId: foundItem.svg?.svgId || null,
                };

                mappedItems.push(materialItm);
                allAcceptedMaterials[materialItm.id] = materialItm;
              }
            });

            mappedType.mappedItems = mappedItems;
          });
        });

        return {
          streamSetup,
          allAcceptedMaterials,
        };
      }

      return {
        streamSetup,
        allAcceptedMaterials,
      };

      //  .aggregate([
      //    { $match: { organizationId: organizationId } },
      //    { $unwind: '$streams' },
      //    { $unwind: '$streams.types' },
      //    {
      //      $lookup: {
      //        from: 'default_material_types',
      //        let: { typeId: '$streams.types.id' },
      //        pipeline: [
      //          {
      //            $match: {
      //              $expr: {
      //                $eq: ['$type.typeId', '$$typeId'],
      //              },
      //            },
      //          },
      //        ],
      //        as: 'defaults',
      //      },
      //    },
      //    {
      //      $addFields: {
      //        'streams.types.defaults': {
      //          $arrayElemAt: ['$defaults', 0],
      //        },
      //      },
      //    },
      //    {
      //      $lookup: {
      //        from: 'default_material_items',
      //        let: { typeId: '$streams.types.id' },
      //        pipeline: [
      //          {
      //            $lookup: {
      //              from: 'customer_material_items',
      //              let: { localItemId: '$item.itemId' },
      //              pipeline: [
      //                { $unwind: '$item.itemId' },
      //               // ! No items in polk items match defaults
      //               //  {
      //               //    $match: {
      //               //      organizationId: `${organizationId}`,
      //               //    },
      //               //  },
      //                {
      //                  $match: {
      //                    $expr: {
      //                      $eq: ['$item.itemId', '$$localItemId'],
      //                    },
      //                  },
      //                },
      //              ],
      //              as: 'customerItem',
      //            },
      //          },
      //          {
      //            $match: {
      //              $expr: {
      //                $eq: ['$typeId', '$$typeId'],
      //              },
      //            },
      //          },
      //        ],
      //        as: 'items',
      //      },
      //    },
      //    {
      //      $addFields: {
      //        'streams.types.items': '$items',
      //      },
      //    },
      //    {
      //      $group: {
      //        _id: {
      //          _id: '$_id',
      //          streamName: '$streams.streamName',
      //          active:'$streams.active',
      //          dropoff:'$streams.dropoff',
      //          dontMsg:'$streams.dontMsg',
      //           doMsg: '$streams.doMsg',
      //           fixMsg: '$streams.fixMsg'
      //        },
      //        streams: { $first: '$streams' },
      //        types: { $push: '$streams.types' }
      //      },
      //    },
      //    {
      //      $group: {
      //        _id: '$_id._id',
      //        streams: {
      //          $push: {
      //           streamName: '$_id.streamName',
      //            active:'$_id.active',
      //            dropoff:'$_id.dropoff',
      //            types: '$types',
      //            dontMsg:'$_id.dontMsg',
      //            doMsg: '$_id.doMsg',
      //            fixMsg: '$_id.fixMsg'
      //           },
      //        },
      //      },
      //    },
      //  ]);
    }
  } catch (error) {
    console.error('error: ', error);
    return error;
  }
};

// ****************************
// â†‘ new search query functions
// ****************************

export const getCustomerInfo = async (
  db: Realm.Services.MongoDBDatabase,
  orgId: string
) => {
  try {
    if (db && db.collection) {
      const customerInfo = await db.collection('organization').aggregate([
        { $match: { id: orgId } },
        {
          $lookup: {
            from: 'customer_stream_types',
            localField: 'id',
            foreignField: 'organizationId',
            as: 'streams',
          },
        },
      ]);

      if (
        customerInfo[0] &&
        customerInfo[0]?.streams?.length > 0 &&
        customerInfo[0]?.streams[0]?.streams[0]
      ) {
        customerInfo[0].streams = customerInfo[0].streams[0].streams;
      }

      return customerInfo[0];
    }
  } catch (error) {
    return error;
  }

  return null;
};

export const getGameQuestions = async (db: Realm.Services.MongoDBDatabase) => {
  try {
    if (db && db.collection) {
      const questions = await db.collection('test_qna').find();
      return questions;
    }
  } catch (error) {
    return null;
  }

  return null;
};

export const saveFeedback = async (
  db: Realm.Services.MongoDBDatabase,
  info: any
) => {
  // const res = await db.collection(`feedback`).insertOne(info)
  // return res
  db.collection(`feedback`)
    .insertMany([info])
    .then((result: any) => console.log(`Successfully inserted item`))
    .catch((err: any) => console.error(`Failed to insert item: ${err}`));
};

export const getNearbyPlastic = async (db: Realm.Services.MongoDBDatabase) => {
  const res = await db.collection(`recycling_locs`).find({
    accepted_mats: 'plastic_bags',
  });
  return res;
};

export const getGenericDetectedMaterial = async (
  db: Realm.Services.MongoDBDatabase,
  title: string
) => {
  const res = await db.collection(`material`).find({
    $or: [{ item: { $eq: `${title}` } }],
    //  detectedItem.map(itm=>{
    //     return
    // })
  });

  return res;
};

export const getGenericMatById = async (
  db: Realm.Services.MongoDBDatabase,
  id: string
) => {
  const res = await db.collection(`material`).find({
    _id: new BSON.ObjectId(JSON.parse(JSON.stringify(id))),
  });

  return res;
};

export const getTopOfLeaderboard = async (
  db: Realm.Services.MongoDBDatabase
) => {
  const res = await db.collection(`user_profile`).aggregate([
    // First sort all the docs by name
    { $sort: { 'stats.totalPoints': -1 } },
    // Take the first 100 of those
    { $limit: 100 },
  ]);

  return res;
};

export const saveSingleQuestion = async (
  dbq: IDbQuestion,
  db: Realm.Services.MongoDBDatabase
) => {
  const res = await db.collection(`test_qna`).updateOne(
    {
      id: dbq.id,
    },
    {
      $set: {
        ...dbq,
      },
    },
    { upsert: true }
  );
};

// Soft delete a question
export const deleteSingleQuestion = async (
  db: Realm.Services.MongoDBDatabase,
  qId: string
) => {
  const question = await db.collection(`test_qna`).findOne({ id: qId });

  if (question) {
    await db
      .collection(`test_qna`)
      .updateOne(
        { id: qId },
        { $set: { isDeleted: true, deletedAt: new Date() } }
      );
  }
};

// Soft delete multiple questions
export const deleteMultipleQuestions = async (
  db: Realm.Services.MongoDBDatabase,
  qIds: string[]
) => {
  await db
    .collection('test_qna')
    .updateMany(
      { id: { $in: qIds } },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );
};

// export const deleteSingleQuestion = async (
//   db: Realm.Services.MongoDBDatabase,
//   qId: string
// ) => {
//   try {
//     const res = await db.collection(`test_qna`).deleteOne({
//       id: qId,
//     });

//     return res;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

export const removeSingleQuestion = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  qId: string
) => {
  try {
    // Log the parameters to ensure they are correct
    console.log(
      `Attempting to remove question ID ${qId} from module ${moduleId}`
    );

    // Perform the update operation
    const res = await db.collection('default_modules').updateOne(
      { moduleId }, // Match the document by moduleId
      { $pull: { qs: qId } } // Use $pull to remove the question ID from the qs array
    );

    // Handle the result
    if (res.matchedCount === 0) {
      console.log(`No module found with ID ${moduleId}`);
    } else if (res.modifiedCount === 0) {
      console.log(`Question ID ${qId} was not found in module ID ${moduleId}`);
    } else {
      console.log(
        `Question ID ${qId} successfully removed from module ID ${moduleId}`
      );
    }

    return res;
  } catch (error) {
    console.error('Failed to remove question from module:', error);
    return null;
  }
};

export const saveSliderImage = async (img: ISliderImagesModel) => {
  const api = getAwsApiUrl('savesliderimgs');
  if (!api) {
    console.warn('AWS configuration not available. Image saving is only available in the cloud version.');
    return;
  }
  
  try {
    const axiosRes = await axios.post(api, {
      img,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAvaFromBucket = async (objId: string) => {
  const api = getAwsApiUrl('getavafrombucket');
  if (!api) {
    console.warn('AWS configuration not available. Avatar retrieval is only available in the cloud version.');
    return { imgId: null };
  }

  try {
    const axiosRes = await axios.post(api, {
      id: objId,
    });

    if (axiosRes && axiosRes.data.statusCode === 200) {
      return JSON.parse(axiosRes.data.body);
    }

    return { imgId: null };
  } catch (error) {
    console.error(error);
    return { imgId: null };
  }
};

// export const get3dLibraryFromBucket = async (): Promise<IGlb[]> => {
//   const api = `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/get3dlibrary`;

//   try {
//     const axiosRes = await axios.post(api);

//     if (axiosRes && axiosRes.data.statusCode === 200) {
//       const objects: I3DObject[] = JSON.parse(axiosRes.data.body);
//       return objects.map((obj) => ({
//         glb: null, // Placeholder for the actual GLB data
//         type: DefaultOrCustom.custom,
//         glbType: GLBType.avatar, // Adjust this based on your type system
//         fName: obj.key.split('/').pop() || '', // Extract the file name
//         url: obj.url,
//       }));
//     }

//     return [];
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };
export const bulkUpload3DToServer = async (files: File[]): Promise<void> => {
  const api = getAwsApiUrl('bulkUpload3DToServer');
  if (!api) {
    console.warn('AWS configuration not available. 3D upload is only available in the cloud version.');
    throw new Error('AWS configuration not available. 3D upload is only available in the cloud version.');
  }

  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });

  try {
    const axiosRes = await axios.post(api, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (axiosRes && axiosRes.status === 200) {
      console.log('Bulk upload to server successful');
    } else {
      throw new Error('Failed to upload the files to server');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const upload3DToS3 = async (file: File): Promise<string> => {
  const api = getAwsApiUrl('upload3DToS3');
  if (!api) {
    console.warn('AWS configuration not available. 3D upload is only available in the cloud version.');
    throw new Error('AWS configuration not available. 3D upload is only available in the cloud version.');
  }

  try {
    // Convert the file to base64
    const base64Content = (await toBase64(file)) as string;

    console.log('Base64 Content:', base64Content.slice(0, 100)); // Log a portion of the base64 string

    // Construct the request body as a JSON object
    const requestBody = JSON.stringify({
      fileName: file.name,
      fileContent: base64Content,
    });

    console.log('Request Body:', requestBody.slice(0, 100)); // Log the beginning of the request body

    // Send the JSON request body to the API
    const axiosRes = await axios.post(
      api,
      requestBody, // This should be a properly formatted JSON string
      {
        headers: {
          'Content-Type': 'application/json', // Ensure the Content-Type is JSON
        },
      }
    );

    console.log('Received response from S3 upload:', axiosRes.data); // Add logging

    // Handle the response
    if (axiosRes && axiosRes.status === 200) {
      // Make sure that axiosRes.data is a string before parsing
      return axiosRes.data.url; // Directly access the URL if the response is already an object
    }

    throw new Error('Failed to upload the file');
  } catch (error) {
    console.error('Error during S3 upload:', error); // Add logging
    throw error;
  }
};

export const generateThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      loader.parse(
        arrayBuffer,
        '',
        (gltf) => {
          const scene = new THREE.Scene();

          // Add ambient light for better overall illumination
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Softer white light
          scene.add(ambientLight);

          // Add directional light to bring out more color and detail
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(5, 5, 5).normalize(); // Position the light
          scene.add(directionalLight);

          // Center the model using the bounding box
          const bbox = new THREE.Box3().setFromObject(gltf.scene);
          const center = bbox.getCenter(new THREE.Vector3());
          gltf.scene.position.sub(center);

          // Scale the model to fit the view
          const size = bbox.getSize(new THREE.Vector3()).length();
          const scaleFactor = 3 / size; // Increase scale factor for larger view
          gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

          // Add the model to the scene
          scene.add(gltf.scene);

          // Set up the camera closer to the object
          const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
          camera.position.set(0, 0, size * 1.2); // Adjust the camera distance

          // Create the WebGLRenderer
          const renderer = new THREE.WebGLRenderer({ alpha: true });
          renderer.setSize(512, 512);

          // Add a gradient background
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // Create a radial gradient
            const gradient = ctx.createRadialGradient(
              canvas.width / 2,
              canvas.height / 2,
              0, // Start from the very center
              canvas.width / 2,
              canvas.height / 2,
              Math.max(canvas.width, canvas.height) // Extend to cover the entire canvas
            );

            gradient.addColorStop(0, '#303030'); // Bright center (light gray)
            gradient.addColorStop(0.6, '#1a1a1a'); // Darker gray mid-point
            gradient.addColorStop(1, '#000000'); // Black edges

            // Apply the gradient to the background
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          // Render the scene onto the background
          renderer.setClearColor(0x000000, 0); // Transparent background
          renderer.render(scene, camera);

          const modelImage = renderer.domElement.toDataURL('image/png');
          const background = canvas.toDataURL('image/png');

          // Merge the model and background
          const finalCanvas = document.createElement('canvas');
          finalCanvas.width = 512;
          finalCanvas.height = 512;
          const finalCtx = finalCanvas.getContext('2d');

          if (finalCtx) {
            const backgroundImg = new Image();
            backgroundImg.onload = () => {
              finalCtx.drawImage(backgroundImg, 0, 0, 512, 512);

              const modelImg = new Image();
              modelImg.onload = () => {
                finalCtx.drawImage(modelImg, 0, 0, 512, 512);
                resolve(finalCanvas.toDataURL('image/png'));
              };
              modelImg.src = modelImage;
            };
            backgroundImg.src = background;
          }
        },
        reject
      );
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const saveMetadataToMongoDB = async (
  db: Realm.Services.MongoDBDatabase,
  file: File,
  s3Url: string,
  objId: string,
  uid: string,
  thumbnail: string,
  name: string,
  recUse: string
): Promise<IGlb> => {
  // UPDATED RETURN TYPE TO IGlb
  const timestamp = new Date().toISOString();
  const objectData: IGlb = {
    objId: objId,
    uid: uid,
    objExt: 'glb',
    fName: file.name,
    name: name || '',
    fileSize: file.size,
    uploadedAt: timestamp,
    lstMod: timestamp,
    type: 'custom',
    thumbnail,
    thumbnailUrl: `${uid}/${thumbnail}.png`,
    s3Url: s3Url, // New field to store the full S3 key
    recUse: recUse || 'Dodge',
  };

  console.log('Preparing to save metadata for 3Dlib', objectData);

  try {
    const insertResult = await db
      .collection('3d_library')
      .insertOne(objectData);
    if (insertResult.insertedId) {
      console.log(
        `3D object metadata successfully saved with ID: ${insertResult.insertedId}`
      );
    } else {
      console.error('Failed to insert 3D object metadata into MongoDB.');
    }

    return objectData;
  } catch (error) {
    console.error('Error saving 3D object to MongoDB:', error);
    throw error;
  }
};

export const generateThumbnailBulk = async (s3Url: string): Promise<string> => {
  const api = `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/generateThumbnailBulk`;

  try {
    const axiosRes = await axios.post(api, { url: s3Url });

    if (axiosRes && axiosRes.status === 200) {
      return axiosRes.data.thumbnailUrl; // Assuming the response contains the thumbnail URL
    }

    throw new Error('Failed to generate the thumbnail');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDbImage = async (imgId: string, imgType: IImgType) => {
  const api = `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/getsliderimgs`;
  try {
    const axiosRes = await axios.post(api, {
      imgId,
      imgType,
    });

    if (axiosRes && axiosRes.data.statusCode === 200) {
      return JSON.parse(axiosRes.data.body);
    }

    return { imgId: null };
  } catch (error) {
    console.error(error);
  }
};

export const saveCalendarEvent = async (
  db: Realm.Services.MongoDBDatabase,
  event: CalendarEventModel
) => {
  const res = await db.collection(`calendar_event`).updateOne(
    {
      eventId: event.eventId,
    },
    {
      ...event,
      _partition: `${event.calendarId}`,
    },
    { upsert: true }
  );

  //Publish notification if applicable

  if (event?.alert && event?.title) {
    const api = `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/sesEmail`;

    try {
      const axiosRes = await axios.post(api, {
        detail: event.detail || '',
        subject: event.title,
        alertType: event.alert.alertType,
      });

      if (axiosRes) {
        //TODO:handle errors
      }
    } catch (error) {
      console.error(error);
    }
  }

  return res;
};

export const unsubscribeToNotifications = async () => {
  // let axiosRes = null
  // const api =
  //   `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/unsubscribeToNotifications`
  // try {
  //   axiosRes = await axios.post(api, {
  //     Protocol: evt.protocol,
  //     Endpoint: evt.endpoint,
  //   })
  // } catch (error) {
  //   console.error(error)
  // }
  // return axiosRes
};

export const subscribeToNotifications = async (evt: ISubcribeModel) => {
  let axiosRes = null;
  const api = `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/subscribeToNotifications`;
  try {
    axiosRes = await axios.post(api, {
      Protocol: evt.protocol,
      Endpoint: evt.endpoint,
    });
  } catch (error) {
    console.error(error);
  }

  return axiosRes;
};

export const saveScannedImg = async (imgData: IScannedImgDataModel) => {
  let axiosRes = null;
  const api = `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/savescanimg`;
  try {
    axiosRes = await axios.post(api, {
      imgData: {
        ...imgData,
      },
      id: imgData.id,
    });
  } catch (error) {
    console.error(error);
  }

  return axiosRes;
};

export const sendPasswordReset = () => {
  return;
};

export const saveDashboardSettingsToDb = async (
  db: Realm.Services.MongoDBDatabase,
  settings: ISliderSettings,
  customerId: string,
  upsert = true
) => {
  try {
    const res = await db.collection(`organization`).updateOne(
      {
        id: customerId,
      },
      {
        $set: {
          dashboardSettings: settings,
        },
      },
      { upsert }
    );

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const saveSettingsToDb = async (
  db: Realm.Services.MongoDBDatabase,
  settings: IAppSettings,
  customerId: string,
  upsert = true
) => {
  try {
    const res = await db.collection(`organization`).updateOne(
      {
        id: customerId,
      },
      {
        $set: {
          dashboardSettings: settings,
        },
      },
      { upsert }
    );

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// Generate a random URL code for games
export const generateRandomURLCode = (length = 8) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const createNewModule = async (
  db: Realm.Services.MongoDBDatabase,
  currUser: IDashboardUserModel
) => {
  try {
    const moduleId = uuidv4();
    const url = generateRandomURLCode();
    const now = Date.now(); // Current timestamp
    const insertRes = await db.collection(`default_modules`).insertOne({
      coin: 'UUID',
      scenes: [],
      qs: [],
      avatars: [],
      moduleId: moduleId,
      selectedDodge: [],
      selectedJump: [],
      selectedSlide: [],
      settings: {
        limit: 3,
        random: true,
        gTitle: '',
        gDesc: '',
        url: url,
        loginLvl: 1,
      },
      uid: currUser.uid,
      isDeleted: false,
      themeId: null,
      // orgId: currUser.accessibleOrgs[0] || null,
      // Add new timestamp properties
      createdOn: now,
      updatedOn: now,
    });
    return { moduleId, url };
  } catch (error) {
    console.error('Error creating module:', error);
    throw error;
  }
};

export const getModulesByOrg = async (
  db: Realm.Services.MongoDBDatabase,
  modIds: string[]
) => {
  try {
    const res = await db.collection('default_modules').find({
      moduleId: {
        $in: modIds,
      },
    });

    return res;
  } catch (error) {
    console.error('Error fetching modules:', error);
    return null;
  }
};

export const getCurrUsrModProgress = async ({
  db,
  uid,
  moduleId,
}: {
  db: Realm.Services.MongoDBDatabase;
  uid: string;
  moduleId: string;
}) => {
  try {
    const res = await db.collection('user_game_progress').findOne({
      uid,
      moduleId,
    });

    return res;
  } catch (error) {
    console.error('Error fetching user module progress:', error);
    return null;
  }
};

export const updateUserModuleProgress = async ({
  db,
  moduleId,
  uid,
  questData,
}: {
  db: Realm.Services.MongoDBDatabase;
  uid: string;
  moduleId: string;
  questData: IQuestData;
}) => {
  try {
    const res = await db.collection('user_game_progress').updateOne(
      {
        uid,
        moduleId,
      },
      {
        $set: {
          questData,
          uid,
          moduleId,
        },
      },
      {
        upsert: true,
      }
    );

    return res;
  } catch (error) {
    console.error('Error updating user module progress:', error);
    return null;
  }
};

export const getGameSessionByQs = async ({
  db,
  uid,
  moduleId,
  questAttempt,
}: {
  db: Realm.Services.MongoDBDatabase;
  uid: string;
  moduleId: string;
  questAttempt: number;
}) => {
  try {
    const gameSessionsByAttempt = await db
      .collection('game_session')
      .aggregate([
        {
          $match: {
            uid: uid,
            gameId: moduleId,
            questAttempt,
          },
        },
      ]);

    return gameSessionsByAttempt || [];
  } catch (error) {
    console.error('Error fetching module data:', error);
    return [];
  }
};

export const getModuleById = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string
) => {
  try {
    const res = await db.collection('default_modules').findOne({
      $or: [
        { moduleId: { $eq: moduleId } },
        { 'settings.url': { $eq: moduleId } },
      ],
    });

    if (res && isArray(res.qs) && res.qs.length > 0) {
      const questions = await db.collection('test_qna').find({
        id: {
          $in: res.qs,
        },
      });

      res.qs = questions || [];
    }

    return res;
  } catch (error) {
    console.error('Error fetching module data:', error);
    return null;
  }
};

export const getDashQsByModule = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string
) => {
  try {
    const res = await db.collection('default_modules').find({
      moduleId,
    });

    if (res && res[0].qs) {
      const questions = await db.collection('test_qna').find({
        id: {
          $in: res[0].qs,
        },
        isDeleted: false, //Exclude deleted questions
      });

      return questions;
    }

    return null;
  } catch (error) {
    console.error('Error fetching module data:', error);
  }

  return null;
};

export const getUsrTrivia = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
) => {
  try {
    const res = await db.collection('test_qna').aggregate([
      {
        $match: {
          uid,
          isDeleted: { $eq: false }, //Exclude deleted questions
        },
      },
      {
        $sort: {
          createdAt: -1, // Sort by 'createdAt' in descending order
        },
      },
    ]);

    return res;
  } catch (error) {
    console.error('Error fetching module data:', error);
  }
};

export const getUsrProfile = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
) => {
  try {
    const res = await db.collection('user_profile').findOne({ uid });

    if (!res) {
      return null;
    }

    return res;
  } catch (error) {
    return null;
  }
};

// export const getUsrTrivia = async (
//   db: Realm.Services.MongoDBDatabase,
//   uid: string
// ) => {
//   try {
//     const res = await db.collection('test_qna').aggregate([
//       {
//         $match: {
//           uid,
//         },
//       },
//       {
//         $lookup: {
//           from: 'test_qna',
//           localField: 'qs',
//           foreignField: 'id',
//           as: 'qs',
//         },
//       },
//       {
//         $unwind: '$qs',
//       },
//       {
//         $addFields: {
//           xformedQ: '$qs.xformedQ',
//           xformedExp: '$qs.xformedExp',
//           xformedS: '$qs.xformedS',
//           answers: '$qs.answers',
//           qType: '$qs.CurrQType',
//           correctAnswerIdx: '$qs.correctAnswerIdx',
//           qAsset: '$qs.qAsset',
//           qs: '$qs.id'
//         },
//       },
//       // {
//       //   $project: {
//       //     qs: 0, // Remove the original qs array
//       //   },
//       // },
//     ]);
//     console.log('User Trivia data fetched successfully:', res);

//     return res;
//   } catch (error) {
//     console.error('Error fetching module data:', error);
//   }};

export const getModulesByUser = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
) => {
  try {
    const modules = await db.collection('default_modules').find({ uid });
    return modules;
  } catch (error) {
    console.error('Failed to fetch modules by user:', error);
    throw error;
  }
};

export const getUsrFiles = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
) => {
  try {
    const files = await db.collection('file_lib').aggregate([
      {
        $match: {
          uid,
          isDeleted: { $eq: false }, //Exclude deleted files
        },
      },
      {
        $sort: {
          uploadedAt: -1, // Sort by 'uploadedAt' in descending order
        },
      },
    ]);
    return files;
  } catch (error) {
    console.error('Failed to fetch files by user:', error);
    throw error;
  }
};

export const saveUsrFile = async (
  db: Realm.Services.MongoDBDatabase,
  fileData: IFile
) => {
  try {
    // INSERT FILE INTO THE FILE_LIB COLLECTION
    await db.collection('file_lib').insertOne(fileData);
  } catch (error) {
    console.error('Failed to save file data:', error);
    throw error;
  }
};

export const saveSponsorMeta = async ({
  db,
  id,
  contentType,
}: {
  db: Realm.Services.MongoDBDatabase;
  contentType: ESponsorContentType;
  id: string;
}) => {
  try {
    const res = await db.collection('sponsor_content').updateOne(
      {
        id,
      },
      {
        $set: {
          contentType,
          id,
        },
      },
      {
        upsert: true,
      }
    );
    return res;
  } catch (error) {
    console.error('Error fetching module data:', error);
    return null;
  }
};

// Soft delete a file
export const deleteFile = async (
  db: Realm.Services.MongoDBDatabase,
  fileId: string
) => {
  const file = await db.collection('file_lib').findOne({ id: fileId });

  if (file) {
    await db
      .collection('file_lib')
      .updateOne(
        { id: fileId },
        { $set: { isDeleted: true, deletedAt: new Date() } }
      );
  }
};

export const getOrgTrivia = async (
  db: Realm.Services.MongoDBDatabase,
  orgId: string
) => {
  try {
    const res = await db.collection(`test_qna`).find({
      orgId,
    });

    return isArray(res) ? res : [];
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateTriviaQuestion = async (
  id: string,
  updatedQuestion: IDbQuestion,
  db: Realm.Services.MongoDBDatabase
) => {
  try {
    const collection = db.collection('test_qna');
    await collection.updateOne({ id }, { $set: updatedQuestion });
  } catch (error) {
    console.error('Error updating trivia question:', error);
  }
};

export const updateModuleSettings = async ({
  db,
  moduleId,
  settings,
  key,
}: {
  db: Realm.Services.MongoDBDatabase;
  moduleId: string;
  settings: ICustomModule;
  key?: string;
}) => {
  const updateQuery = key
    ? { $set: { [`settings.${key}`]: settings[key as keyof ICustomModule] } }
    : { $set: { settings } };
  try {
    await db.collection('default_modules').updateOne({ moduleId }, updateQuery);
  } catch (error) {
    console.error('Failed to update module questions:', error);
    throw error;
  }
};

export const updateModuleQuestions = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  newQuestionId: string,
  oldQuestionId: string
) => {
  try {
    await db
      .collection('default_modules')
      .updateOne(
        { moduleId },
        { $pull: { qs: oldQuestionId }, $push: { qs: newQuestionId } }
      );
    console.log(
      `Replaced question ID ${oldQuestionId} with ${newQuestionId} in module ${moduleId}`
    );
  } catch (error) {
    console.error('Failed to update module questions:', error);
    throw error;
  }
};

export const newModuleQuestion = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  newQuestionId: string
) => {
  try {
    console.log(
      `Attempting to add question ID ${newQuestionId} to module ${moduleId}`
    );

    // Perform the update operation
    const result = await db
      .collection('default_modules')
      .updateOne({ moduleId }, { $push: { qs: newQuestionId } });

    // Log the result of the update operation
    if (result.matchedCount === 0) {
      console.warn(`No module found with ID ${moduleId}`);
    } else if (result.modifiedCount === 0) {
      console.warn(
        `Module ${moduleId} was found, but the question ID ${newQuestionId} was not added. It might already exist in the array.`
      );
    } else {
      console.log(
        `Successfully added question ID ${newQuestionId} to module ${moduleId}`
      );
    }

    console.log('Update result:', result);
  } catch (error) {
    console.error('Failed to update module questions:', error);
    throw error;
  }
};

export const newModuleTrivia = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  qIds: string[]
) => {
  try {
    // Perform the update operation with an array of question IDs
    await db
      .collection('default_modules')
      .updateOne({ moduleId }, { $push: { qs: { $each: qIds } } });
  } catch (error) {
    console.error('Failed to update module questions:', error);
    throw error;
  }
};

export const newTriviaQnA = async (
  question: IDbQuestion,
  db: Realm.Services.MongoDBDatabase,
  uid: string,
  moduleId: string,
  orgId?: string
): Promise<{ id: string }> => {
  try {
    const newQuestionData: IDbQuestion = {
      ...question,
      uid: uid,
      version: question.version, // The version is incremented in handleSaveClick
      createdAt: question.createdAt || new Date().toISOString(), // Ensure createdAt is set
    };

    if (orgId) {
      newQuestionData.orgId = orgId;
    }

    console.log('Final question data before insertion:', newQuestionData);

    // Insert the new question into the database
    const res = await db.collection('test_qna').insertOne(newQuestionData);

    const savedId = newQuestionData.id; // Get the ID of the newly inserted document
    console.log(`New question inserted with id: ${savedId}`);

    return { id: savedId };
  } catch (error) {
    console.error('Failed to save question:', error);
    throw error;
  }
};

export const newTriviaQuestions = async (
  triviaArr: IDbQuestion[],
  db: Realm.Services.MongoDBDatabase
) => {
  try {
    // Insert the new questions into the database
    await db.collection('test_qna').insertMany(triviaArr);
  } catch (error) {
    console.error('Failed to save new trivia questions:', error);
    throw error;
  }
};

// export const saveTrivia = async (
//   question: IDbQuestion,
//   db: Realm.Services.MongoDBDatabase,
//   uid: string,
//   moduleId: string,
//   orgId?: string
// ): Promise<{ id: string }> => {
//   try {
//     const updateData: IDbQuestion = {
//       ...question,
//       uid: uid,
//       version: question.version + 1,
//     };

//     if (orgId) {
//       updateData.orgId = orgId;
//     }

//     const res = await db.collection('test_qna').updateOne(
//       { id: question.id },
//       { $set: updateData },
//       { upsert: true }
//     );

//     const savedId = res.upsertedId ? res.upsertedId.toString() : question.id;

//     await updateModuleQuestions(db, moduleId, savedId, question.id); // Pass question.id as oldQuestionId

//     return { id: savedId };
//   } catch (error) {
//     console.error('Failed to save question:', error);
//     throw error;
//   }
// };

// export const saveTrivia = async (
//   question: IDbQuestion,
//   db: Realm.Services.MongoDBDatabase,
//   uid: string,
//   moduleId: string,
//   orgId?: string
// ): Promise<{ id: string }> => { // Ensure the return type is correct
//   try {
//     const updateData: any = {
//       question: question.xformedQ,
//       answers: question.answers,
//       correctAnswerIdx: question.correctAnswerIdx,
//       xformedQ: question.xformedQ,
//       xformedExp: question.xformedExp,
//       xformedS: question.xformedS,
//       qAsset: question.qAsset
//         ? { type: question.qAsset.fileType, id: question.qAsset.aId }
//         : null,
//       version: question.version + 1,
//       parent_id: question.parent_id,
//       uid: uid
//     };

//     if (orgId) {
//       updateData.orgId = orgId;
//     }

//     const res = await db.collection('test_qna').updateOne(
//       { id: question.id },
//       { $set: updateData },
//       { upsert: true }
//     );

//     const savedId = res.upsertedId ? res.upsertedId.toString() : question.id;

//     // await db.collection('default_modules').updateOne(
//     //   { id: moduleId },
//     //   { $push: { questions: savedId } }
//     // );

//     return { id: savedId }; // Ensure this function always returns an object with an `id`
//   } catch (error) {
//     console.error('Failed to save question:', error);
//     throw error;
//   }
// };

export const importTrivia = async (
  csvData: any[], // Array of trivia data from CSV
  db: Realm.Services.MongoDBDatabase, // MongoDB database instance
  user: IDashboardUserModel,
  questionIds?: string[] // id's of generated trivia questions
) => {
  if (!user.uid) {
    throw new Error('User UID is missing.');
  }

  if (db && csvData.length > 0) {
    const collection = await db.collection('test_qna'); // Await the collection
    const dbQuestionsArr: IDbQuestion[] = [];
    let i = 0;
    for (const row of csvData) {
      console.log('Processing row:', row);

      // Log before transformation
      console.log('Original Question:', row['Question']);
      console.log('Original Explanation:', row['Explanation']);
      console.log('Original Source:', row['Source']);

      // Generate a unique UUID for the id
      let id;
      if (!questionIds) {
        id = uuidv4();
      } else {
        id = questionIds[i];
      }
      i += 1;

      // Extract the answer type from the QuestionType column
      const CurrQType = row['QuestionType'];

      // Transform the text fields using the xformedUtils function
      const xformedQ = xformedUtils(row['Question']);
      const xformedExp = xformedUtils(row['Explanation']);
      const xformedS = xformedSource(row['Source']);

      const answers = [
        { txt: row['Answer1'], color: 'black' },
        { txt: row['Answer2'], color: 'black' },
        { txt: row['Answer3'], color: 'black' },
        { txt: row['Answer4'], color: 'black' },
      ].filter((answer) => answer.txt !== '');

      // Parse the correct answer index
      const correctAnswerIdx = parseInt(row['CorrectAnswer'], 10) - 1;

      const hints: IHint[] = row['Hints']
        ? [
            { title: 'Hint 1', xformedH: xformedUtils(row['Hints'][0]) }, // Get two hints
            { title: 'Hint 2', xformedH: xformedUtils(row['Hints'][1]) },
          ]
        : []; // Default to an empty array if no hints are provided

      // Attempt to parse answers if it's a valid JSON string
      const triviaDoc: IDbQuestion = {
        id,
        uid: user.uid,
        CurrQType,
        xformedQ,
        hints, // Add the hints array
        answers,
        correctAnswerIdx,
        xformedExp,
        xformedS,
        qAsset: row.qAsset
          ? { fileType: '', aId: '', fileName: '' } // Placeholder for asset details
          : undefined, // Or keep it undefined if not provided
        ///VERSION
        version: 1,
        parent_id: null,
        createdAt: new Date().toISOString(), // Add the current timestamp
        isDeleted: false,
      };

      await collection.insertOne(triviaDoc); // Await the insert operation
      dbQuestionsArr.push(triviaDoc);
    }
    return dbQuestionsArr;
  } else {
    console.error('Database connection, CSV data, or UID is missing');
    throw new Error('Database connection, CSV data, or UID is missing');
  }
};

export const getOrgFaqs = async (
  db: Realm.Services.MongoDBDatabase,
  orgId: string
) => {
  try {
    const res = await db.collection(`customer_faqs`).findOne({
      organizationId: orgId,
    });

    return res?.faqs || [];
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const saveFaqs = async (
  db: Realm.Services.MongoDBDatabase,
  faqs: ISingleQuestionModel[],
  organizationId: string,
  upsert = true
) => {
  try {
    const res = await db.collection(`customer_faqs`).updateOne(
      {
        organizationId,
      },
      {
        $set: {
          faqs,
          _partition: organizationId,
        },
      },
      { upsert }
    );

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getOrgSlides = async (
  db: Realm.Services.MongoDBDatabase,
  orgId: string
) => {
  try {
    const res = await db.collection(`customer_sliders`).findOne({
      id: orgId,
    });

    return res?.slides || [];
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getModItms = async (avas: IGlb[], path: string) => {
  let dbcalls: any[] = [];
  const loader = new GLTFLoader();
  avas.forEach(async (ava) => {
    dbcalls.push(async () => {
      try {
        const res = await getPreSignedUrl(`${path}/${ava.objId}.${ava.objExt}`);
        return {
          res,
          type: ava.type,
          id: ava.objId,
          glbType: ava.glbType,
        };
      } catch (error) {
        console.error(error);
      }

      return null;
    });
  });

  const signedUrlArr = await Promise.all(dbcalls.map((fn) => fn()));

  dbcalls = [];
  signedUrlArr.forEach((signedUrl) => {
    if (
      signedUrl?.res?.statusCode === 200 &&
      typeof signedUrl?.res?.body === 'string'
    ) {
      dbcalls.push(async () => {
        const glb = await loader.loadAsync(signedUrl.res.body);
        return {
          res: glb,
          id: signedUrl.id,
          type: signedUrl.type,
          glbType: signedUrl.glbType,
        };
      });
    }
  });

  const objs = await Promise.all(dbcalls.map((fn) => fn()));
  return objs;
};

export const loadGLTFModel = (
  url: string
): Promise<{ scene: any; animations: any }> => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        resolve({
          scene: gltf.scene,
          animations: gltf.animations,
        });
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
};

export const getCustomAvs = async (avas: IGlb[], path: string) => {
  let dbcalls: any[] = [];
  avas.forEach(async (ava) => {
    dbcalls.push(async () => {
      try {
        const res = await getPreSignedUrl(`${path}/${ava.objId}.${ava.objExt}`);
        return {
          res,
          url: '',
          type: ava.type,
          id: ava.objId,
          glbType: ava.glbType,
        };
      } catch (error) {
        console.error(error);
      }

      return null;
    });
  });

  const signedUrlArr = await Promise.all(dbcalls.map((fn) => fn()));

  dbcalls = [];
  signedUrlArr.forEach((signedUrl) => {
    if (
      signedUrl?.res?.statusCode === 200 &&
      typeof signedUrl?.res?.body === 'string'
    ) {
      dbcalls.push(async () => {
        const { scene, animations } = await loadGLTFModel(signedUrl.res.body);
        return {
          res: scene,
          animations: animations,
          url: '',
          id: signedUrl.id,
          type: signedUrl.type,
          glbType: signedUrl.glbType,
        };
      });
    }
  });

  const objs = await Promise.all(dbcalls.map((fn) => fn()));
  return objs;
};

export const getPreSignedUrl = async (fileKey: string, bucketName?: string) => {
  const api = getAwsApiUrl('get-obj-from-bucket');
  const bucket = getBucketName(bucketName);
  
  if (!api || !bucket) {
    console.warn('AWS configuration not available. Pre-signed URL generation is only available in the cloud version.');
    return null;
  }

  try {
    const preUrlResponse = await axios.post(api, {
      fileKey,
      bucketName: bucket,
    });

    return preUrlResponse.data;
  } catch (error) {
    console.error(
      `Error fetching pre-signed URL for fileKey ${fileKey}:`,
      error
    );
    return null;
  }
};

export const removeSponsorToModule = async ({
  db,
  moduleId,
}: {
  db: Realm.Services.MongoDBDatabase;
  moduleId: string;
}) => {
  try {
    const updateResult = await db.collection('default_modules').updateOne(
      { moduleId },
      {
        $set: {
          sponsors: [],
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error('Failed to update sponsor');
    }
    return updateResult;
  } catch (error) {
    console.error('Error adding sponsor to module:', error);
    throw error;
  }
};

export const addSponsorToModule = async ({
  db,
  moduleId,
  sponsorData,
}: {
  db: Realm.Services.MongoDBDatabase;
  moduleId: string;
  sponsorData: {
    id: string;
    type: ESponsorContentType;
    createdAt: string;
    ext: string;
  };
}) => {
  try {
    const updateResult = await db.collection('default_modules').updateOne(
      { moduleId },
      {
        $set: {
          sponsors: [sponsorData],
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error('Failed to update sponsor');
    }
    return updateResult;
  } catch (error) {
    console.error('Error adding sponsor to module:', error);
    throw error;
  }
};

export const addAvaToDb = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  avaId: string,
  mongoObjKey: IGlbObjectKey
) => {
  try {
    const res = await db.collection(`default_modules`).findOne({
      moduleId,
    });

    if (res) {
      const avaArr: IGlb[] = res[mongoObjKey] || [];
      avaArr.push({
        objId: avaId,
        objExt: 'glb',
        type: DefaultOrCustom.custom,
        glbType: GLBType.avatar,
        name: avaId, // Use avaId as the name since we don't have a title
        uid: res.uid || '', // Use the uid from the module document or empty string
        uploadedAt: new Date().toISOString(), // Set current timestamp
        lstMod: new Date().toISOString(), // Set current timestamp
      });

      const upRes = await db.collection(`default_modules`).updateOne(
        {
          moduleId,
        },
        {
          $set: {
            [mongoObjKey]: avaArr,
          },
        },
        { upsert: true }
      );

      return upRes;
    } else {
      return await db.collection(`default_modules`).insertOne({
        moduleId,
        [mongoObjKey]: [
          {
            id: avaId,
            ext: 'glb',
          },
        ],
      });
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const saveModule = async (
  db: Realm.Services.MongoDBDatabase,
  module: ICustomModule
) => {
  try {
    // Get current timestamp
    const now = Date.now();

    // Check if the module already exists to determine if this is a new module
    const existingModule = await db.collection(`default_modules`).findOne({
      moduleId: module.moduleId,
    });

    const isNewModule = !existingModule;

    const upRes = await db.collection(`default_modules`).updateOne(
      {
        moduleId: module.moduleId,
      },
      {
        $set: {
          avatars: module.avatars,
          name: module.name,
          // Preserve original createdOn if it exists, otherwise set to current time
          createdOn: module.createdOn || existingModule?.createdOn || now,
          // Always update the updatedOn timestamp
          updatedOn: now,
          subject: module.subject,
          qs: module.qs,
          slideObj: module.selectedSlide,
          scenes: module.scenes,
          dodgeObj: module.selectedDodge,
          jumpObj: module.selectedJump,
        },
      },
      { upsert: true } // Create if it doesn't exist
    );
    return upRes;
  } catch (error) {
    return error;
  }
};

export const savePage = async (
  db: Realm.Services.MongoDBDatabase,
  page: IPageModel
) => {
  const updateData: Partial<IPageModel> = {
    pageTitle: page.pageTitle,
    modules: page.modules,
    socialLinks: page.socialLinks,
    pendingVerification: page.pendingVerification,
    verified: page.verified,
    handle: page.handle,
    pageImg: page.pageImg,
    bannerImg: page.bannerImg,
    bio: page.bio,
    featuredModuleIds: page.featuredModuleIds,
  };

  (Object.keys(updateData) as Array<keyof Partial<IPageModel>>).forEach(key => {
      if (updateData[key] === undefined) {
          delete updateData[key];
      }
  });

  const upRes = await db.collection(`pages`).updateOne(
    {
      pageId: page.pageId,
    },
    {
      $set: updateData,
    },
    { upsert: true }
  );

  return upRes;
};

export const loadPages = async (
  db: Realm.Services.MongoDBDatabase,
  page: IPageModel
) => {
  const updateData: Partial<IPageModel> = {
    pageTitle: page.pageTitle,
    modules: page.modules,
    socialLinks: page.socialLinks,
    pendingVerification: page.pendingVerification,
    verified: page.verified,
    handle: page.handle,
    pageImg: page.pageImg,
    bannerImg: page.bannerImg,
    bio: page.bio,
    featuredModuleIds: page.featuredModuleIds,
  };

  (Object.keys(updateData) as Array<keyof Partial<IPageModel>>).forEach(key => {
      if (updateData[key] === undefined) {
          delete updateData[key];
      }
  });

  const upRes = await db.collection(`pages`).updateOne(
    {
      pageId: page.pageId,
    },
    {
      $set: updateData,
    },
    { upsert: true }
  );

  return upRes;
};

export const putPreSignedUrl = async (
  fileKey: string,
  file: File,
  bucketName?: string
) => {
  try {
    // Step 1: Get the pre-signed URL
    const response = await axios.post(
      `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/get-obj-from-bucket`,
      {
        fileKey,
        bucketName: bucketName ? bucketName : process.env['NX_AVATAR_BUCKET'],
        commandType: 'put',
      }
    );
    let preSignedUrl = response.data.body;

    // Step 2: Sanitize the pre-signed URL
    preSignedUrl = preSignedUrl.replace(/^"|"$/g, ''); // Remove any leading or trailing quotes

    // Step 2: Use the pre-signed URL to upload the file
    const result = await axios.put(preSignedUrl, file, {
      headers: {
        'Content-Type': file.type, // Use the file's MIME type
      },
    });

    // Return the pre-signed URL
    return preSignedUrl; // RETURN THE URL ONLY, NOT THE AXIOS RESPONSE
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const saveSlides = async (
  db: Realm.Services.MongoDBDatabase,
  slides: SingleSlideModel[],
  customerId: string,
  upsert = true
) => {
  try {
    const newSlides = slides.map((slide) => {
      let date = null;
      if (typeof slide.date === 'string') {
        date = slide.date;
      }

      if (slide.date && slide.date.toISOString) {
        date = slide.date.toISOString();
      }

      return {
        ...slide,
        date,
      };
    });
    const res = await db.collection(`customer_sliders`).updateOne(
      {
        id: customerId,
      },
      {
        $set: {
          slides: newSlides,
          _partition: customerId,
        },
      },
      { upsert }
    );

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const saveUsrOrgRel = async (
  db: Realm.Services.MongoDBDatabase,
  rel: IUserOrgRelation,
  upsert = true
) => {
  try {
    const res = await db.collection(`user_org_relation`).updateOne(
      {
        relId: rel.relId,
      },
      {
        $set: {
          orgId: rel.orgId,
          roles: rel.roles,
          uid: rel.uid,
          relId: rel.relId,
        },
      },
      { upsert }
    );

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const getDashProfileByEmail = async (
  db: Realm.Services.MongoDBDatabase,
  email: string
) => {
  try {
    const res = await db.collection(`user_profile`).findOne({
      email,
    });

    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getGameProfileByEmail = async (
  db: Realm.Services.MongoDBDatabase,
  email: string
) => {
  try {
    const res = await db.collection(`user_game_profile`).findOne({
      email,
    });

    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateDashboardUser = async (
  db: Realm.Services.MongoDBDatabase,
  email: string,
  keyValPair: any
) => {
  try {
    const res = await db.collection(`user_profile`).updateOne(
      {
        email,
      },
      {
        $set: keyValPair,
      },
      { upsert: true }
    );

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateUserCurrentSubMonth = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string,
  newDate: Date
) => {
  try {
    const res = await db.collection(`user_profile`).updateOne(
      {
        uid,
      },
      {
        $set: { 'plan.currentSubMonth': newDate },
      }
    );

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getUserScores = async (
  db: Realm.Services.MongoDBDatabase,
  gameId: string
): Promise<IGameProfile[]> => {
  try {
    const pipeline = [
      { $match: { gameId } },

      // Group max score per part, per user
      {
        $group: {
          _id: { uid: '$uid', part: '$questPart' },
          partScore: { $max: '$score' },
        },
      },

      // Reshape to group by user and collect parts
      {
        $group: {
          _id: '$_id.uid',
          parts: {
            $push: {
              part: '$_id.part',
              score: '$partScore',
            },
          },
          totalScore: { $sum: '$partScore' },
        },
      },

      // Final formatting and sorting
      {
        $project: {
          uid: '$_id',
          score: { $round: ['$totalScore', 2] },
          parts: 1,
          _id: 0,
        },
      },

      { $sort: { score: -1 } },
      { $limit: 30 },
    ];

    const scores = await db.collection('game_session').aggregate(pipeline);

    // ENRICH SCORES WITH DISPLAY NAMES
    const enriched = await enrichUserProfiles(db, scores);

    return enriched;
  } catch (error) {
    console.error('getUserScores - Error:', error);
    return [];
  }
};

// ✅ PROFILE ENRICHMENT HANDLER
const enrichUserProfiles = async (
  db: Realm.Services.MongoDBDatabase,
  scores: any[]
): Promise<IGameProfile[]> => {
  const uids = scores.map((s) => s.uid);
  const profiles = await db
    .collection('user_game_profile')
    .find({ uid: { $in: uids } });
  const profileMap = Object.fromEntries(
    profiles.map((p) => [p.uid, p.displayName])
  );

  for (const score of scores) {
    score.displayName = profileMap[score.uid] || nameGenerator();
  }

  return scores;
};

export const updateGameUser = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string,
  keyValPair: any
) => {
  if (!uid || !keyValPair) {
    throw new Error('Email and keyValPair must be provided');
  }

  try {
    const res = await db.collection(`user_game_profile`).updateOne(
      {
        uid,
      },
      {
        $set: keyValPair,
      },
      { upsert: true }
    );

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const saveGameUser = async (
  db: Realm.Services.MongoDBDatabase,
  user: IGameUserModel
) => {
  try {
    const res = await db.collection(`user_game_profile`).updateOne(
      {
        uid: user.uid,
      },
      {
        $set: {
          uid: user.uid,
          username: user.email,
          email: user.email,
          phone: user.phone,
          identities: user.identities,
        },
      },
      { upsert: true }
    );

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const saveDashboardUser = async (
  db: Realm.Services.MongoDBDatabase,
  user: IDashboardUserModel,
  upsert = true
) => {
  try {
    const res = await db.collection(`user_profile`).updateOne(
      {
        uid: user.uid,
      },
      {
        $set: {
          uid: user.uid,
          username: user.email,
          modules: user.modules,
          metadata: user.metadata,
          firstName: user.firstName,
          lastname: user.lastName,
          email: user.email,
          plan: user.plan,
          identities: user.identities,
        },
      },
      { upsert: true }
    );

    return res;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const saveUserData = async (
  db: Realm.Services.MongoDBDatabase,
  user: ICurrentUserModel,
  realmUser: Realm.User,
  upsert = true
) => {
  const res = await db.collection(`user_profile`).updateOne(
    {
      uid: realmUser.id,
    },
    {
      ...user,
      uid: realmUser.id,
      username: realmUser.profile.email,
      _partition: `${realmUser.id}`,
    },
    { upsert: true }
  );

  return res;
};

export const saveUserProfileData = async (
  db: Realm.Services.MongoDBDatabase,
  user: IDashboardUserModel,
  upsert = true
) => {
  try {
    const updateFields = {
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      modules: user.modules || [],
      metadata: {
        lastLogin: user.metadata?.lastLogin || new Date(),
        createdAt: user.metadata?.createdAt || new Date(),
        updatedAt: new Date(),
      },
      username: user.username || '',
      plan: {
        planId: user.plan?.planId || '',
        planStartDate: user.plan?.startDate || null,
        planEndDate: user.plan?.endDate || null,
      },
    };

    // Perform an upsert to update existing documents or insert new ones if they don't exist
    const res = await db
      .collection('user_profile')
      .updateOne({ uid: user.uid }, { $set: updateFields }, { upsert });

    console.log('User profile data saved successfully:', res);
    return res;
  } catch (error) {
    console.error('Failed to save user profile data:', error);
    throw error;
  }
};

export const sendCode = async (username: string, isEmail: boolean) => {
  let axiosRes = null;
  const api = `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/sendSmsVerification`;
  try {
    axiosRes = await axios.post(api, {
      username,
      isEmail,
    });
  } catch (error) {
    console.error(error);
  }

  return axiosRes;
};

export const verifyCode = async (username: string, otp: string) => {
  let axiosRes = null;
  const api = `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/verifyPhone`;
  try {
    axiosRes = await axios.post(api, {
      username,
      otp,
    });
  } catch (error) {
    console.error(error);
  }

  return axiosRes;
};

export const getMaterialSearchOptions = async (
  db: Realm.Services.MongoDBDatabase,
  str: string
) => {
  const arr: RecycleSearchOotionModel[] = [];
  if (db && db.collection) {
    const mats = await db.collection(`default_material_items`).aggregate([
      {
        $search: {
          compound: {
            should: [
              {
                autocomplete: {
                  query: str,
                  path: 'synonyms',
                },
              },
              {
                autocomplete: {
                  query: str,
                  path: 'item.itemName',
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          item: 1,
        },
      },
    ]);

    mats.forEach((mat: any) => {
      arr.push({
        label: mat.item.itemName,
        id: mat.item.itemId,
      });
    });
  }

  return arr;
};

export const getAddySearchOptions = async (
  db: Realm.Services.MongoDBDatabase,
  str: string
) => {
  let arr = [];
  if (db && db.collection) {
    const addys = await db.collection(`assessment_rolls`).aggregate([
      {
        $search: {
          index: 'default',
          autocomplete: {
            query: str,
            path: 'PROP_LOCAT',
          },
        },
      },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          PROP_LOCAT: 1,
          Recycling_: 1,
          Yard_Day: 1,
          Trash_Day: 1,
        },
      },
    ]);

    arr = addys.map((addy: any) => {
      return {
        label: addy.PROP_LOCAT,
        recyclingDay: addy.Recycling_,
        yardDay: addy.Yard_Day,
        trashDay: addy.Trash_Day,
      };
    });
  }

  return arr;
};

export const getEvents = async (
  db: Realm.Services.MongoDBDatabase,
  calendarId: string
) => {
  if (db && db.collection) {
    try {
      const calendarEvents = await db.collection(`calendar_event`).find({
        calendarId: calendarId,
      });

      return calendarEvents;
    } catch (error) {
      console.log(error);
    }
  }

  return null;
};

export const getAverageWaitByDay = async (
  db: Realm.Services.MongoDBDatabase,
  locationId: string
) => {
  if (db && db.collection) {
    try {
      const waitObj: Record<string, { $avg: string }> = {};
      for (let i = 1; i < 25; i++) {
        waitObj[`avgWait_${i}`] = {
          $avg: `$minPerHr.${i}`,
        };
      }

      const timesByDay = await db.collection(`landfill_times`).aggregate([
        { $match: { location: locationId } },
        {
          $group: {
            _id: '$day',
            ...waitObj,
          },
        },
      ]);

      return timesByDay;
    } catch (error) {
      console.log(error);
    }
  }

  return null;
};

export const getLocsByOrg = async (
  db: Realm.Services.MongoDBDatabase,
  locations: string[]
) => {
  if (db && db.collection && locations.length > 0) {
    try {
      const locs: ILocation[] = await db.collection(`locations`).find({
        $or: locations.map((locationId) => {
          return {
            locationId,
          };
        }),
      });

      return locs;
    } catch (error) {
      console.log(error);
    }
  }

  return [];
};

export const updateGameSession = async ({
  db,
  gameSession,
  keyValPair,
  sessionId,
}: {
  db: Realm.Services.MongoDBDatabase;
  gameSession?: IGameSession;
  keyValPair?: any;
  sessionId: string;
}) => {
  try {
    const props = gameSession || keyValPair;

    if (props && db && db.collection) { // Add check for db and db.collection
      const res = await db.collection(`game_session`).updateOne(
        {
          sessionId,
        },
        {
          $set: props,
        },
        { upsert: true }
      );

      return res;
    } else {
      console.warn(`[MongoQueries] updateGameSession skipped: Missing props or db connection for sessionId: ${sessionId}`);
      return null;
    }
  } catch (error) {
    console.error(`[MongoQueries] Error in updateGameSession for sessionId: ${sessionId}:`, error);
    return null; // Explicitly return null on error
  }
};

export const getDefaultMatTypes = async (
  db: Realm.Services.MongoDBDatabase
) => {
  let defaultTypes = [];
  if (db && db.collection) {
    try {
      defaultTypes = await db.collection(`default_material_types`).find();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return defaultTypes;
};

export const getMatByLabelMapId = async (
  db: Realm.Services.MongoDBDatabase,
  id: number
) => {
  if (db && db.collection) {
    try {
      const res = await db.collection(`default_material_items`).findOne({
        'labelmap.labelmapId': id,
      });

      return res;
    } catch (error) {
      console.log(error);
    }
  }
};

//TODO:figure out lookup issue
export const getItmByLabelmap = async (
  db: Realm.Services.MongoDBDatabase,
  labelMapId: number
) => {
  if (db && db.collection) {
    try {
      const itm = await db.collection(`default_material_items`).aggregate([
        {
          $match: {
            'labelmap.labelmapId': labelMapId,
          },
        },
      ]);

      if (itm && itm.length > 0) {
        const customItm = await db
          .collection(`customer_material_items`)
          .findOne({
            'item.itemId': itm[0].item.itemId,
          });

        if (customItm) {
          itm.customItm = customItm;
        }
      }

      return itm;
    } catch (error) {
      console.log(error);
    }
  }

  return null;
};

export const verifyToken = async (email: string, token: string) => {
  let axiosRes = null;
  const api = `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/verify-token`;
  try {
    axiosRes = await axios.post(api, {
      email,
      token,
      isDev: process.env['NX_IS_DEV'],
    });

    if (axiosRes) {
      return {
        verified: axiosRes.data.status === 200,
        status: axiosRes.data.status,
      };
    }
  } catch (error) {
    return {
      verified: false,
      status: 500,
      msg: error,
    };
  }

  return {
    verified: false,
    stauts: 500,
    msg: 'There was a db issue',
  };
};

export const checkEmailExists = async ({
  email,
  db,
  collectionName,
}: {
  email: string;
  db: Realm.Services.MongoDBDatabase;
  collectionName: 'user_profile' | 'user_game_profile';
}) => {
  if (db && db.collection) {
    try {
      const res = await db.collection(collectionName).findOne({
        email,
      });

      if (res) {
        return {
          exists: true,
          status: 200,
          profile: res,
        };
      }

      return {
        exists: false,
        status: 404,
      };
    } catch (error) {
      return {
        exists: false,
        status: 500,
        msg: error,
      };
    }
  }

  return {
    exists: false,
    message: 'Database not found',
  };
};

export const sendMagicLink = async (email: string, callbackUrl?: string) => {
  const api = `https://${process.env['NX_AWS_GATEWAY_CODE']}.execute-api.us-east-1.amazonaws.com/production/createmagiclink`;

  try {
    const axiosRes = await axios.post(api, {
      email,
      isDev: process.env['NX_IS_DEV'],
      domain: window.location.origin,
      callbackUrl,
    });

    if (axiosRes && axiosRes.status === 200) {
      return axiosRes.data;
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// export const getUserPages = async (
//   db: Realm.Services.MongoDBDatabase,
//   uid: string
// ) => {
//   if (db && db.collection) {
//     try {
//       const res = await db.collection('pages').find({
//         uid,
//       });

//       if (res && res.length > 0) {
//         const orgs = await db.collection('organization').find({
//           id: {
//             $in: res.map((rel) => rel.orgId),
//           },
//         });

//         return orgs;
//       }

//       return [];
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   }

//   return [];
// };

export const getUserOrgs = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
) => {
  if (db && db.collection) {
    try {
      const res = await db.collection('user_org_relation').find({
        uid,
      });

      if (res && res.length > 0) {
        const orgs = await db.collection('organization').find({
          id: {
            $in: res.map((rel) => rel.orgId),
          },
        });

        return orgs;
      }

      return [];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return [];
};

export const fetchSettings = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string
) => {
  if (db && db.collection) {
    try {
      const res = await db.collection('default_modules').findOne({
        moduleId,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }
};

export const insertModUrl = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  shareUrl: string
) => {
  return await db
    .collection('mod_urls')
    .updateOne(
      { moduleId: moduleId },
      { $set: { 'settings.url': shareUrl } },
      { upsert: true }
    );
};

export const updateSelectedProps = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  type: string,
  data: IGlb[]
) => {
  const fieldMap: { [key: string]: string } = {
    avatars: 'avatars',
    selectedDodge: 'selectedDodge',
    selectedJump: 'selectedJump',
    selectedSlide: 'selectedSlide',
  };

  const field = fieldMap[type];
  if (!field) {
    console.error('Invalid type specified for update');
    return;
  }

  try {
    await db
      .collection('default_modules')
      .updateOne({ moduleId: moduleId }, { $set: { [field]: data } });
  } catch (error) {
    console.error('Failed to save data to MongoDB:', error);
  }
};

export const fetch3DObjects = async (db: Realm.Services.MongoDBDatabase) => {
  let objId = [];
  if (db && db.collection) {
    try {
      objId = await db.collection(`3d_library`).find();
    } catch (error) {
      console.log(error);
    }
  }

  return objId;
};

export const updateArrayInDocument = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  arrayName: string,
  arrayData: any[],
  index: number
) => {
  try {
    const updateField = `${arrayName}.${index}`;
    const updateData: ISelect3DMod = {};
    updateData[updateField] = arrayData[index];

    await db
      .collection('default_modules')
      .updateOne({ moduleId }, { $set: updateData });
    console.log(
      `Successfully updated ${arrayName} in MongoDB at index ${index}.`
    );
  } catch (error) {
    console.error(`Failed to update ${arrayName} in MongoDB:`, error);
  }
};

export async function fetchModuleObjects(
  db: Realm.Services.MongoDBDatabase, // Add type annotation for db
  moduleId: string // Add type annotation for moduleId
) {
  const moduleDoc = await db
    .collection('default_modules')
    .findOne({ moduleId });
  if (moduleDoc) {
    return {
      avatars: moduleDoc.avatars.map((obj: any) => {
        // Handle both new string format and old object format
        if (typeof obj === 'string') {
          return { id: obj, ext: 'glb' };
        }
        return { id: obj.id, ext: obj.ext };
      }),
      selectedDodge: moduleDoc.selectedDodge.map((obj: any) => {
        // Handle both new string format and old object format
        if (typeof obj === 'string') {
          return { id: obj, ext: 'glb' };
        }
        return { id: obj.id, ext: 'glb' };
      }),
      selectedJump: moduleDoc.selectedJump.map((obj: any) => {
        // Handle both new string format and old object format
        if (typeof obj === 'string') {
          return { id: obj, ext: 'glb' };
        }
        return { id: obj.id, ext: 'glb' };
      }),
      selectedSlide: moduleDoc.selectedSlide.map((obj: any) => {
        // Handle both new string format and old object format
        if (typeof obj === 'string') {
          return { id: obj, ext: 'glb' };
        }
        return { id: obj.id, ext: 'glb' };
      }),
    };
  }
  return null;
}



export const getCustomThumbnailsFromMongo = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
): Promise<IGlb[]> => {
  // Add uid to filter to only return matching user objects
  const filter = { type: 'custom', uid };
  let thumbnails: IGlb[] = [];

  if (db && db.collection) {
    try {
      console.log(`Fetching custom 3D objects for user ID: ${uid}`);
      const objects = await db.collection('3d_library').find(filter);
      console.log(
        `Fetched ${objects.length} objects from 3d_library for user ID: ${uid}.`
      );

      const thumbnailPromises = objects.map(async (obj: IGlb) => {
        let thumbnailUrl = '';

        if (obj.thumbnail && typeof obj.thumbnail === 'string') {
          const thumbnailData = await db
            .collection('img_lib')
            .findOne({ id: obj.thumbnail });
          if (thumbnailData) {
            // Include uid in thumbnailKey to access the correct folder in S3
            const thumbnailKey = `${uid}/${thumbnailData.id}.${thumbnailData.ext}`;
            const thumbnailUrlResponse = await getPreSignedUrl(thumbnailKey);
            thumbnailUrl =
              thumbnailUrlResponse?.body?.replace(/(^")|("$)/g, '') || '';
          } else {
            console.error(
              `Thumbnail data not found in img_lib for thumbnail ID: ${obj.thumbnail}`
            );
          }
        } else {
          console.error(`Thumbnail ID not found for objId: ${obj.objId}`);
        }

        return { ...obj, thumbnail: thumbnailUrl };
      });

      thumbnails = await Promise.all(thumbnailPromises);
      thumbnails.sort(
        (a, b) => new Date(b.lstMod).getTime() - new Date(a.lstMod).getTime()
      );
      console.log(
        `Sorted ${thumbnails.length} custom thumbnails by last modified date.`
      );
    } catch (error) {
      console.error('Error retrieving custom thumbnails from MongoDB:', error);
    }
  }

  return thumbnails;
};

export const getCustomModThumbnails = async (
  db: Realm.Services.MongoDBDatabase,
  objIds: string[], // Array of objId from module objects
  uid: string
): Promise<IGlb[]> => {
  let thumbnails: IGlb[] = [];

  if (db && db.collection) {
    try {
      console.log(
        `Fetching custom 3D objects for objIds: ${objIds.join(', ')}`
      );

      // Query the 3d_library to get object data for matching objIds
      const objects = await db.collection('3d_library').find({
        objId: { $in: objIds },
        uid, // Ensure we only fetch objects belonging to the user
        type: 'custom', // Limit to custom objects
      });

      console.log(
        `Fetched ${objects.length} objects from 3d_library for user ID: ${uid}.`
      );

      const thumbnailPromises = objects.map(async (obj: IGlb) => {
        let thumbnailUrl = '';
        if (obj.thumbnailUrl && typeof obj.thumbnailUrl === 'string') {
          const thumbnailUrlResponse = await getPreSignedUrl(obj.thumbnailUrl);
          thumbnailUrl =
            thumbnailUrlResponse?.body?.replace(/(^")|("$)/g, '') || '';
        } else {
          console.error(`Thumbnail URL not found for objId: ${obj.objId}`);
        }

        // Return the object with the resolved thumbnail URL
        return { ...obj, thumbnail: thumbnailUrl };
      });

      thumbnails = await Promise.all(thumbnailPromises);
      thumbnails.sort(
        (a, b) => new Date(b.lstMod).getTime() - new Date(a.lstMod).getTime()
      );
      console.log(
        `Sorted ${thumbnails.length} custom thumbnails by last modified date.`
      );
    } catch (error) {
      console.error('Error retrieving custom thumbnails from MongoDB:', error);
    }
  }

  return thumbnails;
};

export const getOrgById = async (
  db: Realm.Services.MongoDBDatabase,
  id: string
) => {
  try {
    return await db.collection('organization').findOne({ id });
  } catch (error) {
    console.error('Error retrieving default thumbnails from MongoDB:', error);
  }
};

// export const getTemplateObjectIds = async (
//   db: Realm.Services.MongoDBDatabase,
//   templateId: string
// ): Promise<{ id: string; type: 'default' | 'custom' }[]> => {
//   const templateDoc = await db
//     .collection('3d_templates')
//     .findOne({ templateId });
//   if (!templateId) {
//     return [];
//   }

//   const objectIds = [
//     ...templateDoc.avatars.map(
//       (avatar: { id: string; type: 'default' | 'custom' }) => ({
//         id: avatar.id,
//         type: avatar.type,
//       })
//     ),
//     ...templateDoc.selectedDodge
//       .map((dodge: { id: string; type: 'default' | 'custom' } | null) =>
//         dodge ? { id: dodge.id, type: dodge.type } : null
//       )
//       .filter(Boolean),
//     ...templateDoc.selectedJump
//       .map((jump: { id: string; type: 'default' | 'custom' } | null) =>
//         jump ? { id: jump.id, type: jump.type } : null
//       )
//       .filter(Boolean),
//     ...templateDoc.selectedSlide
//       .map((slide: { id: string; type: 'default' | 'custom' } | null) =>
//         slide ? { id: slide.id, type: slide.type } : null
//       )
//       .filter(Boolean),
//   ];

//   const uniqueObjectIds = [...new Set(objectIds.map((obj) => obj.id))].map(
//     (id) => objectIds.find((obj) => obj.id === id)
//   );

//   return uniqueObjectIds;
// };

export const getModuleObjectIds = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string
): Promise<{ id: string; type: 'default' | 'custom' }[]> => {
  const moduleDoc = await db
    .collection('default_modules')
    .findOne({ moduleId });
  if (!moduleDoc) {
    return [];
  }

  const objectIds = [
    ...(moduleDoc.avatars || []).map(
      (avatar: string | { id: string; type: 'default' | 'custom' }) => {
        // Handle both new string format and old object format
        if (typeof avatar === 'string') {
          // For strings, we need to look up the type from the 3d_library
          // For now, return with a default type - could be enhanced to query the library
          return { id: avatar, type: 'default' as const };
        }
        return { id: avatar.id, type: avatar.type };
      }
    ),
    ...(moduleDoc.selectedDodge || [])
      .map((dodge: string | { id: string; type: 'default' | 'custom' } | null) => {
        if (!dodge) return null;
        // Handle both new string format and old object format
        if (typeof dodge === 'string') {
          return { id: dodge, type: 'default' as const };
        }
        return { id: dodge.id, type: dodge.type };
      })
      .filter(Boolean),
    ...(moduleDoc.selectedJump || [])
      .map((jump: string | { id: string; type: 'default' | 'custom' } | null) => {
        if (!jump) return null;
        // Handle both new string format and old object format
        if (typeof jump === 'string') {
          return { id: jump, type: 'default' as const };
        }
        return { id: jump.id, type: jump.type };
      })
      .filter(Boolean),
    ...(moduleDoc.selectedSlide || [])
      .map((slide: string | { id: string; type: 'default' | 'custom' } | null) => {
        if (!slide) return null;
        // Handle both new string format and old object format
        if (typeof slide === 'string') {
          return { id: slide, type: 'default' as const };
        }
        return { id: slide.id, type: slide.type };
      })
      .filter(Boolean),
  ];

  const uniqueObjectIds = [...new Set(objectIds.map((obj) => obj.id))].map(
    (id) => objectIds.find((obj) => obj.id === id)
  ).filter((obj): obj is { id: string; type: 'default' | 'custom' } => obj !== undefined);

  return uniqueObjectIds;
};

export const getDefaultTemplates = async (
  db: Realm.Services.MongoDBDatabase
): Promise<IHeroTemplate[]> => {
  try {
    const collection = db.collection('3d_templates');
    const query = { type: 'default' };

    // Fetch the templates from the database
    const templates = await collection.find(query);

    // Ensure the templates match the IHeroTemplate interface
    return templates.map((template: any) => ({
      id: template.id,
      title: template.title,
      tags: template.tags,
      description: template.description,
      heroArr: template.heroArr,
      jumpArr: template.jumpArr,
      duckArr: template.duckArr,
      dodgeArr: template.dodgeArr,
      type: template.type,
      thumbnail: template.thumbnail,
    }));
  } catch (error) {
    console.error('Error fetching default templates from MongoDB:', error);
    throw error;
  }
};

export const applyTemplateToModule = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  templateId: string
) => {
  try {
    // Fetch the template data
    const templateData = await db
      .collection('3d_templates')
      .findOne({ id: templateId });

    if (!templateData) {
      console.error(`No template found with id: ${templateId}`);
      return;
    }

    const { heroArr, jumpArr, duckArr, dodgeArr, themeId } = templateData;

    // Helper function to get object data (only objId, ext, type)
    const getObjectData = async (objIds: string[]) => {
      const objectData = await db
        .collection('3d_library')
        .find({ objId: { $in: objIds } });

      return objectData.map((obj: any) => ({
        id: obj.objId, // objId
        ext: obj.objExt, // file extension (glb, etc.)
        type: obj.type, // type (custom or default)
      }));
    };

    // Update the module with just the objId arrays (strings) instead of full objects
    await db.collection('default_modules').updateOne(
      { moduleId },
      {
        $set: {
          avatars: heroArr, // Hero objId strings
          selectedJump: jumpArr, // Jump objId strings
          selectedSlide: duckArr, // Duck/Slide objId strings
          selectedDodge: dodgeArr, // Dodge objId strings
          themeId: themeId, // Theme ID from template
        },
      },
      { upsert: true } // Insert if the document doesn't exist
    );

    console.log(`Module updated with template data and theme.`);
  } catch (error) {
    console.error(`Error in applyTemplateToModule: ${error}`);
    throw error;
  }
};

export const getThumbnailByObjId = async (
  db: Realm.Services.MongoDBDatabase,
  objId: string
): Promise<{ id: string; ext: string } | null> => {
  console.log(`Fetching thumbnail for objId: ${objId}`);

  const obj = await db.collection('3d_library').findOne({ objId });

  if (!obj) {
    console.error(`No object found for objId: ${objId}`);
    return null;
  }

  if (!obj.thumbnail) {
    console.error(`No thumbnail found for objId: ${objId}`);
    return null;
  }

  if (typeof obj.thumbnail !== 'object') {
    console.error(`Thumbnail is not an object for objId: ${objId}`);
    return null;
  }

  console.log(`Found thumbnail for objId: ${objId}, thumbnail:`, obj.thumbnail);

  return {
    id: obj.thumbnail.id,
    ext: obj.thumbnail.ext,
  };
};

// MongoDB Query to save the thumbnail metadata
export const saveModImg = async (
  moduleId: string,
  imgId: string,
  db: Realm.Services.MongoDBDatabase
) => {
  try {
    // Log the start of the update process
    console.log('Starting update process for moduleId:', moduleId);

    // Update the metadata in MongoDB
    await db
      .collection('default_modules')
      .updateOne({ moduleId }, { $set: { imgId } });

    // Log the success of the update
    console.log('Metadata updated successfully in MongoDB.');
    return true; // Indicate success
  } catch (err) {
    // Log the error
    console.error('Error updating metadata or uploading to S3:', err);
    throw new Error(
      'Error updating metadata in MongoDB or uploading thumbnail to S3.'
    );
  }
};

// MongoDB Query to fetch image metadata
export const getModImg = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string
) => {
  // Fetch the module from MongoDB using the moduleId
  const module = await db.collection('default_modules').findOne({ moduleId });

  if (module && module.imgId) {
    const imgId = module.imgId;

    // Fetch the image metadata from the 'img_lib' collection using imgId
    const imgMetadata = await db.collection('img_lib').findOne({ id: imgId });

    if (imgMetadata) {
      const { id, ext } = imgMetadata;

      // Fetch the pre-signed URL for the image from S3
      const preSignedUrlResponse = await getPreSignedUrl(`${id}.${ext}`);
      const s3Url = preSignedUrlResponse.body; // Extract the URL from the response

      // Return both the modImg metadata and the S3 URL
      return {
        ...imgMetadata,
        s3Url, // URL to access the image
      };
    } else {
      throw new Error('Image metadata not found for the given imgId.');
    }
  } else {
    throw new Error('imgId not found for the given module.');
  }
};

// MongoDB Query to fetch image metadata with improved S3 organization strategy
export const getImgbyId = async (
  db: Realm.Services.MongoDBDatabase,
  imgId: string
) => {
  try {
    if (!imgId) {
      return null;
    }

    // Fetch the image metadata from the 'img_lib' collection using imgId
    const imgMetadata = await db.collection('img_lib').findOne({ id: imgId });

    if (imgMetadata) {
      const { id, ext, uid, s3Path, assetType, category } = imgMetadata;

      // Determine S3 key based on new organization strategy
      let s3Key: string;

      if (s3Path) {
        // New system: use the explicit S3 path from metadata
        s3Key = s3Path;
      } else {
        // Improved path resolution strategy
        if (assetType && ['logo', 'sponsor', 'template', 'avatar', 'obstacle', 'environment'].includes(assetType)) {
          // Use new organized structure for shared assets
          const assetFolder = assetType === 'logo' ? 'logos' :
                             assetType === 'sponsor' ? 'sponsors' :
                             assetType === 'template' ? 'templates' :
                             assetType === 'avatar' ? 'avatars' :
                             assetType === 'obstacle' ? 'obstacles' : 'environments';
          s3Key = `shared/${assetFolder}/${id}.${ext}`;
        } else if (category === 'game-specific') {
          // Game-specific assets (though we'd need gameId in metadata for this)
          s3Key = `games/${uid}/${id}.${ext}`;
        } else {
          // Legacy fallback: try direct path first (this works based on user's successful test)
          s3Key = `${id}.${ext}`;
        }
      }

      const preSignedUrlResponse = await getPreSignedUrl(s3Key);

      if (preSignedUrlResponse?.body) {
        const s3Url = preSignedUrlResponse.body;

        // Return both the metadata and the S3 URL
        return {
          ...imgMetadata,
          s3Url,
          s3Key, // Include the key used for debugging
        };
      } else {
        // Legacy fallback: if organized path fails, try uid-based path
        if (!s3Path && s3Key !== `${uid}/${id}.${ext}`) {
          const legacyKey = `${uid}/${id}.${ext}`;
          const legacyResponse = await getPreSignedUrl(legacyKey);

          if (legacyResponse?.body) {
            return {
              ...imgMetadata,
              s3Url: legacyResponse.body,
              s3Key: legacyKey,
            };
          }
        }

        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('[getImgbyId] Error fetching image by ID:', error);
    return null;
  }
};

export const removeModImg = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  imgId: string
) => {
  try {
    // Remove the imgId from the module
    await db
      .collection('default_modules')
      .updateOne({ moduleId }, { $set: { imgId: null } });
    return true; // Indicate success
  } catch (error) {
    console.error('Error removing thumbnail:', error);
    throw error;
  }
};

export const saveImageToLib = async ({
  newThumbnail,
  db,
  currUser,
}: {
  newThumbnail: IImage; // The image metadata to save
  db: Realm.Services.MongoDBDatabase; // MongoDB database instance
  currUser: string; // The current user uploading the image
}) => {
  try {
    // Log the start of the save process
    console.log('[saveImageToLib] Saving image metadata to img_lib:', newThumbnail);
    // Insert the new image data into the img_lib collection
    const result = await db.collection('img_lib').insertOne({
      ...newThumbnail, // The full image metadata (id, ext, fname, etc.)
      uploadedBy: currUser, // Who uploaded the image
      createdAt: new Date(), // When the image was created/uploaded
    });
    console.log('[saveImageToLib] Insert result:', result);
    // Check if the insert was successful
    if (!result.insertedId) {
      throw new Error('Error saving image metadata in img_lib.');
    }
    return newThumbnail.id; // Return the newly inserted image ID
  } catch (err) {
    // Log the error
    console.error('[saveImageToLib] Error saving image to img_lib:', err);
    throw new Error('Error saving image to img_lib in MongoDB.');
  }
};

// Soft delete a module (game, etc.)
export const deleteModule = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string
) => {
  const module = await db.collection('default_modules').findOne({ moduleId });

  if (module) {
    await db
      .collection('default_modules')
      .updateOne(
        { moduleId },
        { $set: { isDeleted: true, deletedAt: new Date() } }
      );
  }
};

/**
 * Fetches games from the default_modules collection
 * @param db MongoDB database instance
 * @param filter Optional filter to apply to the query
 * @returns Array of games or empty array if none found
 */
export const getGamesForCarousel = async (
  db: Realm.Services.MongoDBDatabase,
  filter: Record<string, any> = { type: 'custom' },
  options: { limit?: number; skip?: number } = {}
): Promise<any[]> => {
  try {
    if (!db || !db.collection) {
      console.error('Database or collection not available');
      return [];
    }

    const { limit, skip } = options;
    console.log(`Fetching games with limit: ${limit}, skip: ${skip}`);

    // Build the query chain
    const collection = db.collection('default_modules');

    // Create the aggregation pipeline
    const pipeline: any[] = [
      {
        $match: {
          $and: [
            filter,
            {
              'settings.gTitle': { $exists: true, $ne: '' },
              imgId: { $exists: true, $ne: null },
            },
          ],
        },
      },
      // Sort directly by the createdOn timestamp
      { $sort: { createdOn: -1 } },
    ];

    // Add limit and skip stages if provided
    if (skip) {
      pipeline.push({ $skip: skip });
    }

    if (limit) {
      pipeline.push({ $limit: limit });
    }

    // Add the project stage to include necessary fields
    pipeline.push({
      $project: {
        _id: 1,
        moduleId: 1,
        'settings.gTitle': 1,
        'settings.gDesc': 1,
        'settings.url': 1,
        imgId: 1,
        createdOn: 1,
        updatedOn: 1,
        orgId: 1,
        public: 1,
        verified: 1,
      },
    });

    // Execute the aggregation
    return await collection.aggregate(pipeline);
  } catch (error) {
    console.error('Error fetching games for carousel:', error);
    return [];
  }
};

// Define credit costs for each AI generation type
export const AI_CREDIT_COSTS = {
  image: 5, // 5 credits per image generation
  trivia: 1, // 1 credit per trivia question
  quick: 10, // 10 credits base cost for quick game creation (plus 1 per question)
  threeD: 25, // 25 credits per 3D object generation
};

export const saveDocToAIGen = async (
  db: Realm.Services.MongoDBDatabase,
  currUser: string,
  moduleId: string,
  useCase: 'trivia' | 'image' | 'quick' | 'threeD',
  genDetails:
    | TriviaGenDetails
    | ImageGenDetails
    | QuickCreateDetails
    | threeDGenDetails
) => {
  const uploadedAt = new Date().toISOString();
  const objId = uuidv4();

  // Calculate credits used based on useCase
  let creditsUsed = AI_CREDIT_COSTS[useCase as keyof typeof AI_CREDIT_COSTS];

  // For trivia, multiply by number of questions
  if (useCase === 'trivia' || useCase === 'quick') {
    const details = genDetails as TriviaGenDetails | QuickCreateDetails;
    if ('numQuestions' in details && details.numQuestions) {
      creditsUsed =
        useCase === 'trivia'
          ? AI_CREDIT_COSTS.trivia * details.numQuestions
          : 10 + details.numQuestions; // 10 base + 1 per question for quick create
    }
  }

  const objectData: IAIGen = {
    id: objId,
    uid: currUser,
    uploadedAt,
    moduleId,
    useCase,
    creditsUsed,
    genDetails,
  };
  try {
    // INSERT THE OBJECTDATA INTO THE AI_GEN COLLECTION
    await db.collection('ai_gen').insertOne(objectData);

    // Update user's credit balance in the usage collection
    await db
      .collection('usage')
      .updateOne(
        { uid: currUser },
        { $inc: { creditsUsed: creditsUsed } },
        { upsert: true }
      );

    console.log('AI Gen object saved to MongoDB successfully');
  } catch (error) {
    console.error('Error saving AI Gen object to MongoDB:', error);
    throw error;
  }
};
export async function getPlans(db: Realm.Services.MongoDBDatabase) {
  if (!db || !db.collection) {
    throw new Error('Invalid database instance');
  }

  // Fetch the plans directly if find() returns an array
  const plansArray = await db.collection('plans').find({});

  // Map and return the results to fit your application's expected structure
  return plansArray.map((plan) => ({
    planId: plan.planId,
    name: plan.name,
    originalPrice: plan.originalPrice,
    discountPrice: plan.discountPrice,
    features: plan.features,
    planYears: plan.planYears,
    planMonths: plan.planMonths,
    stripePriceId: plan.stripePriceId,
  }));
}

export const getFeatures = async (db: any) => {
  if (db && db.collection) {
    try {
      // Ensure .find() is used correctly with .limit() and .toArray()
      return await db.collection('features').find({}).limit(1000).toArray();
    } catch (error) {
      console.error('Error fetching features:', error);
      throw error;
    }
  } else {
    console.error('Invalid database object');
    return null;
  }
};
// // Soft delete trivia manually
// export const deleteTrivia = async (db, triviaId) => {
//   const trivia = await db.collection('trivia').findOne({ _id: triviaId });

//   if (trivia) {
//     await db.collection('trivia').updateOne(
//       { _id: triviaId },
//       { $set: { isDeleted: true, deletedAt: new Date() } }
//     );
//   }
// };

// // Soft delete a 3D object
// export const delete3DObject = async (db, objectId) => {
//   const object = await db.collection('3dObjects').findOne({ _id: objectId });

//   if (object) {
//     await db.collection('3dObjects').updateOne(
//       { _id: objectId },
//       { $set: { isDeleted: true, deletedAt: new Date() } }
//     );
//   }
// };

// // Soft delete an image
// export const deleteImage = async (db, imageId) => {
//   const image = await db.collection('images').findOne({ _id: imageId });

//   if (image) {
//     await db.collection('images').updateOne(
//       { _id: imageId },
//       { $set: { isDeleted: true, deletedAt: new Date() } }
//     );
//   }
// };

// // Soft delete an audio file
// export const deleteAudio = async (db, audioId) => {
//   const audio = await db.collection('audio').findOne({ _id: audioId });

//   if (audio) {
//     await db.collection('audio').updateOne(
//       { _id: audioId },
//       { $set: { isDeleted: true, deletedAt: new Date() } }
//     );
//   }
// };

// // Scheduled job to clean up permanently after 30 days
// export const cleanupDeletedItems = async (db) => {
//   const dateThreshold = new Date();
//   dateThreshold.setDate(dateThreshold.getDate() - 30);

//   // Permanently delete modules older than 30 days
//   await db.collection('modules').deleteMany({ isDeleted: true, deletedAt: { $lt: dateThreshold } });

//   // Permanently delete trivia older than 30 days
//   await db.collection('trivia').deleteMany({ isDeleted: true, deletedAt: { $lt: dateThreshold } });

//   // Permanently delete 3D objects older than 30 days
//   await db.collection('3dObjects').deleteMany({ isDeleted: true, deletedAt: { $lt: dateThreshold } });

//   // Permanently delete images older than 30 days
//   await db.collection('images').deleteMany({ isDeleted: true, deletedAt: { $lt: dateThreshold } });

//   // Permanently delete audio files older than 30 days
//   await db.collection('audio').deleteMany({ isDeleted: true, deletedAt: { $lt: dateThreshold } });
// };

export const getThemes = async (
  db: Realm.Services.MongoDBDatabase,
  uid?: string
): Promise<ITheme[]> => {
    const collection = db.collection('theme');

    // Get default themes and user's custom themes
    const query = uid
      ? { $or: [{ default: true }, { uid: uid }] }
      : { default: true };

    const themes = await collection.find(query);

    return themes.map((theme: any) => {
      const mappedTheme: ITheme = {
        name: theme.name || 'Untitled Theme',
        description: theme.description || 'No description available',
        default: Boolean(theme.default),
        themeId: theme.themeId || `theme-${Date.now()}`,
        createdAt: theme.createdAt || new Date().toISOString(),
        road: {
          textures: {
            baseColor: theme.road?.textures?.baseColor || 'default_road.jpg',
          },
          properties: {
            reflectivity: theme.road?.properties?.reflectivity || 0.5,
          },
          tiles: {
            x: theme.road?.tiles?.x || 1,
            y: theme.road?.tiles?.y || 1,
          },
        },
        background: {
          textures: {
            baseColor:
              theme.background?.textures?.baseColor || 'default_bg.jpg',
          },
        },
        uid: theme.uid || 'default_user',
      };
      return mappedTheme;
    });
};

export const updateModuleTheme = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string,
  themeId: string
): Promise<void> => {
    const collection = db.collection('default_modules');
    const result = await collection.updateOne(
      { moduleId },
      { $set: { themeId } }
    );

    if (!result.modifiedCount) {
      throw new Error('Failed to update module theme');
  }
};

export const getThemePreview = async (
  db: Realm.Services.MongoDBDatabase,
  moduleId: string
): Promise<ITheme | null> => {
    const moduleDoc = await db
      .collection('default_modules')
      .findOne({ moduleId });
    if (!moduleDoc?.themeId) {
      return null;
    }

    const collection = db.collection('theme');
    const theme = await collection.findOne({ themeId: moduleDoc.themeId });

    if (!theme) {
      return null;
    }

    const mappedTheme: ITheme = {
      name: theme.name || 'Untitled Theme',
      description: theme.description || 'No description available',
      default: Boolean(theme.default),
      themeId: theme.themeId,
      createdAt: theme.createdAt || new Date().toISOString(),
      road: {
        textures: {
          baseColor: theme.road?.textures?.baseColor || 'default_road.jpg',
        },
        properties: {
          reflectivity: theme.road?.properties?.reflectivity || 0.5,
        },
        tiles: {
          x: theme.road?.tiles?.x || 1,
          y: theme.road?.tiles?.y || 1,
        },
      },
      background: {
        textures: {
          baseColor: theme.background?.textures?.baseColor || 'default_bg.jpg',
        },
      },
      uid: theme.uid || 'default_user',
    };

    return mappedTheme;
};

export const fetch3DLibraryObjects = async (
  db: Realm.Services.MongoDBDatabase,
  template: IHeroTemplate
): Promise<any[]> => {
  try {
    // Collect all object IDs from the template
    const objectIds = [
      ...(template.heroArr || []),
      ...(template.jumpArr || []),
      ...(template.duckArr || []),
      ...(template.dodgeArr || []),
    ];

    // Fetch objects from the database
    const objects = await db.collection('3d_library').find({
      objId: { $in: objectIds },
    });

    // Map the objects to include proper thumbnail URLs and titles
    return objects.map((obj) => ({
      ...obj,
      thumbnailUrl:
        obj.type === 'custom'
          ? `/assets/custom/${obj.thumbnail}.png`
          : `/assets/thumbnails/${obj.thumbnail}.png`,
      title: obj.title || obj.objId, // Fallback to objId if no title
    }));
  } catch (error) {
    return [];
  }
};

export const getWikiSearches = async (db: Realm.Services.MongoDBDatabase) => {
    const res = db.collection('wiki_searches').find();
    return res;
};

export const saveOnboardingPhase = async ({
  db,
  userId,
  phase,
  phaseId,
}: {
  db: Realm.Services.MongoDBDatabase;
  userId: string;
  phaseId: OnboardingPhaseName;
  phase: IOnboardingPhase;
}): Promise<void> => {
    await db.collection('user_profile').updateOne(
      { uid: userId },
      {
        $set: {
          [`onboardingPhases.${phaseId}`]: {
            completed: phase.completed,
            completionTimestamp: phase.completionTimestamp,
            dismissed: phase.dismissed || false,
            steps: phase.steps,
          },
        },
      },
      { upsert: true }
    );
};

export const saveDismissedPreference = async (
  db: Realm.Services.MongoDBDatabase,
  userId: string,
  phaseId: string
): Promise<void> => {
    await db.collection('user_profile').updateOne(
      { uid: userId },
      {
        $set: {
          [`onboardingPhases.${phaseId}.dismissed`]: true,
        },
      },
      { upsert: true }
    );
};

export const loadOnboardingStatus = async (
  db: Realm.Services.MongoDBDatabase,
  userId: string
): Promise<{ onboardingPhases?: Record<string, IOnboardingPhase> }> => {
    const profile = await db
      .collection('user_profile')
      .findOne({ uid: userId }, { projection: { onboardingPhases: 1 } });
    return profile || {};
};

export const checkProfileCompletion = async (
  db: Realm.Services.MongoDBDatabase,
  userId: string
): Promise<boolean> => {
    const profile = await db.collection('user_profile').findOne({
      uid: userId,
      firstName: { $exists: true, $ne: '' },
      lastName: { $exists: true, $ne: '' },
      email: { $exists: true, $ne: '' },
      affiliations: { $exists: true, $not: { $size: 0 } },
    });
    return !!profile;
};

export const checkGameCreation = async (
  db: Realm.Services.MongoDBDatabase,
  userId: string
): Promise<boolean> => {
  try {
    if (!db || !userId) return false;

    const modules = await db
      .collection('default_modules')
      .find({ uid: userId });
    return modules.length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Saves a new organization to the database with pending verification status
 * @param db MongoDB database instance
 * @param orgData Organization data to save
 * @returns The saved organization with MongoDB ID
 */
export const saveNewOrganization = async (
  db: Realm.Services.MongoDBDatabase,
  orgData: Partial<IUnivOrg>
): Promise<IUnivOrg> => {
    if (!db) {
      throw new Error('Database connection not found');
    }

    if (!orgData.Organization) {
      throw new Error('Organization name is required');
    }

    if (!orgData.univNum) {
      throw new Error('University number is required');
    }

    // Prepare the organization data
    const newOrg = {
      ...orgData,
      verified: false,
      pendingVerification: true,
      createdAt: new Date(),
    };

    // Insert the new organization
    const result = await db.collection('organization').insertOne(newOrg);

    if (!result.insertedId) {
      throw new Error('Failed to insert new organization');
    }

    // Return the complete organization with MongoDB ID
    return {
      ...newOrg,
      id: result.insertedId.toString(),
    } as IUnivOrg;
};

/**
 * Fetches games from the default_modules collection with pagination
 * @param db MongoDB database instance
 * @param page Page number (0-indexed)
 * @param pageSize Number of items per page
 * @returns Array of games matching the criteria
 */
export const fetchLibraryGames = async (
  db: Realm.Services.MongoDBDatabase,
  page = 0,
  pageSize = 25
): Promise<any[]> => {
  try {
    if (!db || !db.collection) {
      return [];
    }

    const skip = page * pageSize;

    const collection = db.collection('default_modules');
    const filter = {
      isDeleted: { $ne: true },
      public: true,
      verified: true,
      'settings.gTitle': { $exists: true, $ne: '' }, // Filter for titles on server side
      moduleId: { $exists: true }, // Ensure moduleId exists
    };

    const options = {
      projection: {
        _id: 1,
        moduleId: 1,
        'settings.gTitle': 1,
        'settings.gDesc': 1,
        'settings.url': 1,
        primaryCat: 1,
        secondaryCats: 1,
        createdOn: 1, // Include new timestamp field
        updatedOn: 1, // Include new timestamp field
        imgId: 1,
        orgId: 1,
        avatars: 1,
        selectedJump: 1,
        selectedSlide: 1,
        selectedDodge: 1,
        tags: 1,
      },
      sort: { createdOn: -1 }, // Sort by the new timestamp field
      skip: skip,
      limit: pageSize,
    };
    return await collection.find(filter, options);
  } catch (error) {
    return [];
  }
};

export const getSponsorThumbnail = async (imgId: string, extension: string) => {
  try {
    const imageUrl = await getPreSignedUrl(`sponsors/${imgId}.${extension}`);

    return {
      id: imgId,
      ext: extension,
      url: imageUrl,
    };
  } catch (error) {
    console.error('Error getting sponsor thumbnail:', error);
    return null;
  }
};

/**
 * Fetches filtered games from the default_modules collection based on category
 * @param db MongoDB database instance
 * @param categoryId Category ID to filter by
 * @param page Page number (0-indexed)
 * @param pageSize Number of items per page
 * @returns Array of games matching the category criteria
 */
export const fetchFilteredLibraryGames = async (
  db: Realm.Services.MongoDBDatabase,
  categoryId: string,
  page = 0,
  pageSize = 25
): Promise<any[]> => {
  try {
    if (!db || !db.collection) {
      return [];
    }

    const skip = page * pageSize;

    // Create the filter object based on the category ID format
    const filter: any = {
      isDeleted: { $ne: true },
      public: true,
      verified: true,
      'settings.gTitle': { $exists: true, $ne: '' },
      moduleId: { $exists: true },
    };

    // Apply category filtering
    if (categoryId.startsWith('C')) {
      // Main category
      filter.primaryCat = categoryId;
    } else if (categoryId.startsWith('SC')) {
      // Subcategory - apply to either primary or secondary categories
      filter.$or = [{ primaryCat: categoryId }, { secondaryCats: categoryId }];
    }

    const options = {
      projection: {
        _id: 1,
        moduleId: 1,
        'settings.gTitle': 1,
        'settings.gDesc': 1,
        'settings.url': 1,
        primaryCat: 1,
        secondaryCats: 1,
        createdOn: 1, // Include new timestamp field
        updatedOn: 1, // Include new timestamp field
        imgId: 1,
        orgId: 1,
        avatars: 1,
        selectedJump: 1,
        selectedSlide: 1,
        selectedDodge: 1,
        tags: 1,
      },
      sort: { createdOn: -1 }, // Sort by the new timestamp field
      skip: skip,
      limit: pageSize,
    };

    return await db.collection('default_modules').find(filter, options);
  } catch (error) {
    return [];
  }
};

/**
 * Gets child categories for a given category ID
 * @param db MongoDB database instance
 * @param categoryId Parent category ID
 * @returns Array of child category IDs
/**
 * Gets child categories for a given category ID
 * @param db MongoDB database instance
 * @param categoryId Parent category ID
 * @returns Array of child category IDs
 */
export const getChildCategories = async (
  db: Realm.Services.MongoDBDatabase,
  categoryId: string
): Promise<string[]> => {
  try {
    if (!db || !db.collection) {
      return [];
    }

    const collection = db.collection('game_cats');

    const query = {
      $or: [
        { CategoryID: categoryId },
        { SubcategoryID: categoryId },
        { TopicID: categoryId },
        { SubtopicID: categoryId },
      ],
    };

    const projection = {
      projection: {
        _id: 0,
        SubcategoryID: 1,
        TopicID: 1,
        SubtopicID: 1,
      },
    };

    const result = await collection.find(query, projection);

    const childCategories = new Set<string>();

    result.forEach((doc: any) => {
      if (doc.SubcategoryID) childCategories.add(doc.SubcategoryID);
      if (doc.TopicID) childCategories.add(doc.TopicID);
      if (doc.SubtopicID) childCategories.add(doc.SubtopicID);
    });

    return Array.from(childCategories);
  } catch (error) {
    return [];
  }
};

/**
 * Searches for games in the library based on a query string
 * @param db MongoDB database instance
 * @param query Search query string
 * @param limit Maximum number of results to return
 * @returns Array of games matching the search criteria
 */
export const searchLibraryGames = async (
  db: Realm.Services.MongoDBDatabase,
  query: string,
  limit = 25
): Promise<any[]> => {
  try {
    if (!db || !db.collection || !query.trim()) {
      return [];
    }

    const searchLower = query.toLowerCase().trim();
    const collection = db.collection('default_modules');

    const filter = {
      isDeleted: { $ne: true },
      public: true,
      verified: true,
      $or: [
        { 'settings.gTitle': { $regex: searchLower, $options: 'i' } },
        { 'settings.gDesc': { $regex: searchLower, $options: 'i' } },
      ],
    };

    const options = {
      projection: {
        _id: 1,
        moduleId: 1,
        'settings.gTitle': 1,
        'settings.gDesc': 1,
        'settings.url': 1,
        primaryCat: 1,
        secondaryCats: 1,
        createdOn: 1, // Include new timestamp field
        updatedOn: 1, // Include new timestamp field
        imgId: 1,
        orgId: 1,
        avatars: 1,
        selectedJump: 1,
        selectedSlide: 1,
        selectedDodge: 1,
        tags: 1,
      },
      sort: { createdOn: -1 }, // Sort by the new timestamp field
      limit: limit,
    };

    return await collection.find(filter, options);
  } catch (error) {
    return [];
  }
};

export const getTop3UserScores = async (
  db: Realm.Services.MongoDBDatabase,
  gameId: string
): Promise<IGameProfile[]> => {
  try {
    const pipeline = [
      { $match: { gameId } },

      // GROUP MAX SCORE PER PART, PER USER
      {
        $group: {
          _id: { uid: '$uid', part: '$questPart' },
          partScore: { $max: '$score' },
        },
      },

      // GROUP BY USER AND COLLECT PART SCORES
      {
        $group: {
          _id: '$_id.uid',
          parts: {
            $push: {
              part: '$_id.part',
              score: '$partScore',
            },
          },
          totalScore: { $sum: '$partScore' },
        },
      },

      // FORMAT OUTPUT
      {
        $project: {
          uid: '$_id',
          score: { $round: ['$totalScore', 2] },
          parts: 1,
          _id: 0,
        },
      },

      { $sort: { score: -1 } },
      { $limit: 3 },
    ];

    const scores = await db.collection('game_session').aggregate(pipeline);

    // ✅ ENRICH DISPLAY NAMES
    const enriched = await enrichUserProfiles(db, scores);

    return enriched;
  } catch (error) {
    return [];
  }
};

// New function to fetch only the data needed for module progress
export const fetchModProgress = async (
  db: any,
  moduleId: string
): Promise<{
  heroComplete: boolean;
  triviaComplete: boolean;
  playComplete: boolean;
  rawCounts: {
    avatars: number;
    dodge: number;
    jump: number;
    slide: number;
    questions: number;
    hasTitle: boolean;
    hasThumbnail: boolean;
  };
}> => {
  try {
    // Only fetch the fields we need for progress tracking
    const projection = {
      avatars: 1,
      selectedDodge: 1,
      selectedJump: 1,
      selectedSlide: 1,
      qs: 1,
      'settings.gTitle': 1,
      thumbnail: 1,
      imgId: 1,
      moduleId: 1, // Include moduleId for debugging
      _id: 1, // Include _id for debugging
    };

    // The document structure shows moduleId as a string field in the document, not as _id
    // Try to find document by the moduleId field directly, which is the most reliable approach
    let module = await db
      .collection('default_modules')
      .findOne({ moduleId: moduleId }, { projection });

    // Debug what we found
    if (module) {
      // Document found by moduleId field
    } else {
      // Try _id directly as fallback
      try {
        module = await db
          .collection('default_modules')
          .findOne({ _id: moduleId }, { projection });
      } catch (err) {
        // Error with direct _id lookup
      }

      // Try ObjectId format as last resort
      if (!module) {
        try {
          module = await db
            .collection('default_modules')
            .findOne({ _id: { $oid: moduleId } }, { projection });
        } catch (err) {
          // Error with $oid lookup
        }
      }
    }

    if (!module) {
      return {
        heroComplete: false,
        triviaComplete: false,
        playComplete: false,
        rawCounts: {
          avatars: 0,
          dodge: 0,
          jump: 0,
          slide: 0,
          questions: 0,
          hasTitle: false,
          hasThumbnail: false,
        },
      };
    }

    // Count assets
    const avatarCount = Array.isArray(module.avatars)
      ? module.avatars.length
      : 0;
    const dodgeCount = Array.isArray(module.selectedDodge)
      ? module.selectedDodge.length
      : 0;
    const jumpCount = Array.isArray(module.selectedJump)
      ? module.selectedJump.length
      : 0;
    const slideCount = Array.isArray(module.selectedSlide)
      ? module.selectedSlide.length
      : 0;
    const questionCount = Array.isArray(module.qs) ? module.qs.length : 0;
    const hasTitle = !!module.settings?.gTitle;
    const hasThumbnail = !!(module.thumbnail || module.imgId);

    // Determine completion status
    const heroComplete =
      avatarCount >= 3 && dodgeCount >= 2 && jumpCount >= 2 && slideCount >= 2;
    const triviaComplete = questionCount >= 5;
    const playComplete = hasTitle && hasThumbnail;

    return {
      heroComplete,
      triviaComplete,
      playComplete,
      rawCounts: {
        avatars: avatarCount,
        dodge: dodgeCount,
        jump: jumpCount,
        slide: slideCount,
        questions: questionCount,
        hasTitle,
        hasThumbnail,
      },
    };
  } catch (error) {
    return {
      heroComplete: false,
      triviaComplete: false,
      playComplete: false,
      rawCounts: {
        avatars: 0,
        dodge: 0,
        jump: 0,
        slide: 0,
        questions: 0,
        hasTitle: false,
        hasThumbnail: false,
      },
    };
  }
};

/**
 * Fetches plan feature mappings from the database
 * These mappings connect planId to featureId with limits or values
 */
export async function getPlanFeatureMappings(
  db: Realm.Services.MongoDBDatabase
) {
  if (!db || !db.collection) {
    throw new Error('Invalid database instance');
  }

  try {
    // Fetch all plan feature mappings
    const mappingsArray = await db.collection('plans_features').find({});

    // Map and return the results
    return mappingsArray.map((mapping) => ({
      planId: mapping.planId,
      featureId: mapping.featureId,
      availability: mapping.availability || true,
      limit: mapping.limit,
    }));
  } catch (error) {
    // Return an empty array in case of error
    return [];
  }
}

export async function getCachedPlans(db: Realm.Services.MongoDBDatabase) {
  if (!db || !db.collection) {
    return [];
  }

  try {
    const plansArray = await db.collection('plans').find({});

    if (plansArray.length === 0) {
      return [];
    }

    // Map and return the results
    const mappedPlans = plansArray.map((plan) => ({
      planId: plan.planId,
      name: plan.name,
      originalPrice: plan.originalPrice || 0,
      discountPrice: plan.discountPrice || null,
      planMonths: plan.planMonths || 12,
      planYears: plan.planYears || 1,
      stripePriceId: plan.stripePriceId,
    }));

    return mappedPlans;
  } catch (error) {
    return [];
  }
}

export const getCachedFeatures = async (db: Realm.Services.MongoDBDatabase) => {
  if (!db || !db.collection) {
    return [];
  }

  try {
    const featuresArray = await db.collection('features').find({});
    return featuresArray;
  } catch (error) {
    return [];
  }
};

export const getCachedPlanFeatureMappings = async (
  db: Realm.Services.MongoDBDatabase
) => {
  if (!db || !db.collection) {
    return [];
  }

  try {
    const mappingsArray = await db.collection('plans_features').find({});

    if (mappingsArray.length === 0) {
      return [];
    }

    // Map and return the results
    return mappingsArray.map((mapping) => ({
      planId: mapping.planId,
      featureId: mapping.featureId,
      availability: mapping.availability || true,
      limit: mapping.limit,
    }));
  } catch (error) {
    return [];
  }
};

export const getGameProfileByUid = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
): Promise<IGameUserModelFromDb | null> => { // Return type uses IGameUserModelFromDb
  try {
    const res = await db.collection<IGameUserModelFromDb>(`user_game_profile`).findOne({
      uid,
    });
    return res;
  } catch (error) {
    console.error("Error fetching game profile by UID:", error);
    return null;
  }
};

export const getPublicThumbnailsFromMongo = async (
  db: Realm.Services.MongoDBDatabase
): Promise<IGlb[]> => {
  const filter = { isPublic: true };
  let thumbnails: IGlb[] = [];

  if (db && db.collection) {
    try {
      const objects = await db.collection('3d_library').find(filter);
      thumbnails = objects.map((obj: IGlb) => {
        // Generate S3 URL for thumbnail using the thumbnailUrl field
        const thumbnailS3Url = `https://${process.env['NX_AVATAR_BUCKET'] || 'your-bucket-name'}.s3.amazonaws.com/${obj.thumbnailUrl}`;
        return {
          ...obj,
          type: 'custom', // All objects are now type 'custom'
          thumbnail: thumbnailS3Url, // Use S3 URL for thumbnail
          // Ensure s3Url is properly set for the 3D model file access
          s3Url: obj.s3Url || `${obj.uid}/${obj.objId}.${obj.objExt}`,
        };
      });
    } catch (error) {
      // Error retrieving public thumbnails from MongoDB
    }
  }

  return thumbnails;
};

export const getPagesForUser = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
): Promise<IPageModel[]> => {
  if (!db || !uid) return [];
  try {
    const orgRelations = await db.collection('user_org_relation').find({ uid });
    const orgIds = orgRelations.map((rel: any) => rel.orgId);
    const pages = await db.collection('pages').find({ orgId: { $in: orgIds } });
    console.log('getPagesForUser: orgIds', orgIds, 'pages', pages);
    return pages;
  } catch (err) {
    console.error('Error in getPagesForUser:', err);
    return [];
  }
};

export const getPageById = async (
  db: Realm.Services.MongoDBDatabase,
  pageId: string
): Promise<IPageModel | null> => {
  if (!db || !pageId) return null;
  try {
    const page = await db.collection('pages').findOne({ pageId });
    console.log('getPageById:', pageId, page);
    return page || null;
  } catch (err) {
    console.error('Error in getPageById:', err);
    return null;
  }
};

export const createPage = async (
  db: Realm.Services.MongoDBDatabase,
  uid: string
): Promise<IPageModel | null> => {
  if (!db || !uid) return null;

  try {
    // Optionally, fetch orgId for the user (if needed)
    const orgRelations = await db.collection('user_org_relation').find({ uid });
    const orgId = orgRelations.length > 0 ? orgRelations[0].orgId : uuidv4();

    const newPage: IPageModel = {
      pageId: uuidv4(),
      orgId,
      pageTitle: '',
      handle: '',
      pendingVerification: false,
      verified: false,
      modules: [],
      // Add any other required fields or defaults here
    };

    await db.collection('pages').insertOne(newPage);
    return newPage;
  } catch (err) {
    console.error('Error in createPage:', err);
    return null;
  }
};

export const updatePage = async (
  db: Realm.Services.MongoDBDatabase,
  pageId: string,
  updates: Partial<IPageModel>
): Promise<IPageModel | null> => {
  if (!db || !pageId) return null;
  try {
    console.log('[updatePage] Called with pageId:', pageId, 'updates:', JSON.stringify(updates));
    await db.collection('pages').updateOne(
      { pageId },
      { $set: updates }
    );
    // Return the updated page
    const updatedPage = await db.collection('pages').findOne({ pageId });
    console.log('[updatePage] Updated page:', JSON.stringify(updatedPage));
    return updatedPage || null;
  } catch (err) {
    console.error('[updatePage] Error in updatePage:', err);
    return null;
  }
};

// Reusable: Update a single field for a page (e.g., socialLinks)
export const updatePageField = async <K extends keyof IPageModel>(
  db: Realm.Services.MongoDBDatabase,
  pageId: string,
  field: K,
  value: IPageModel[K]
): Promise<IPageModel | null> => {
  if (!db || !pageId) return null;
  try {
    await db.collection('pages').updateOne(
      { pageId },
      { $set: { [field]: value } }
    );
    const updatedPage = await db.collection('pages').findOne({ pageId });
    return updatedPage || null;
  } catch (err) {
    console.error(`Error updating page field ${String(field)}:`, err);
    return null;
  }
};

export const getPageByHandle = async (
  db: Realm.Services.MongoDBDatabase,
  handle: string
): Promise<IPageModel | null> => {
  if (!db || !handle) return null;
  try {
    const page = await db.collection('pages').findOne({ handle });
    return page || null;
  } catch (err) {
    console.error('Error in getPageByHandle:', err);
    return null;
  }
};
