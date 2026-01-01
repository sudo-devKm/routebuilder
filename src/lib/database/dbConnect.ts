// ============== Import Packages ================
import mongoose from 'mongoose';
import logger from '../logger';
// ===============================================
export default class MongoConnect {
  static readonly defaultOptions: mongoose.ConnectOptions = {
    compressors: ['zstd'],
  };

  constructor() {
    // do nothing
  }

  static readonly connect = async (uri: string, options?: mongoose.ConnectOptions) => {
    try {
      mongoose.set('strictQuery', true);
      await mongoose.connect(uri, { ...this.defaultOptions, ...options });
      logger.info('Connected successfully to Database !! :)');
    } catch (err) {
      logger.error(`Something Went Wrong !!`, err);
    }
  };

  static readonly disconnect = async () => {
    try {
      await mongoose.disconnect();
      logger.info('Disconnected successfully from Database !! :)');
    } catch (err) {
      logger.error('Error disconnecting from Database !! :(', err);
      throw err;
    }
  };
}
