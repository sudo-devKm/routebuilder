// ============== Import Packages ================
import mongoose from 'mongoose';
// ===============================================
export default class MongoConnect {
  static readonly defaultOptions: mongoose.ConnectOptions = {
    compressors: ['snappy'],
  };

  constructor() {
    // do nothing
  }

  static readonly connect = async (uri: string, options?: mongoose.ConnectOptions) => {
    try {
      mongoose.set('strictQuery', true);
      const connection = await mongoose.connect(uri, {
        ...this.defaultOptions,
        ...options,
      });
      process.stdout.write('Connected successfully to Database !! :) \n');
    } catch (err) {
      process.stdout.write(`Something Went Wrong !! :( ===> ${err} \n`);
    }
  };
}
