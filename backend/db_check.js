require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('Connected DB:', mongoose.connection.name);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map((c) => c.name));
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`- ${coll.name}: ${count}`);
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('DB check failed:', error);
    process.exit(1);
  }
})();
