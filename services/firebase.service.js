const { getFireStore, auth, admin } = require("../config/firebaseConfig");
const db = getFireStore();
const firebaseService = {
  create: async (data) => {
    try {
      let result = await auth.createUser(user);
      if (result) {
        return await db.collection("users").doc(result.uid).set(data);
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
module.exports = firebaseService;
