const axios = require("axios");

const secretJson = require("../secret.json");
const config = require("./../config/config.json")[secretJson.ENVIRONMENT];

async function createUser(payload) {
  let url = config.FIREBASE_URL + "firebaseapi/createUser";
  try {
    let res = await axios({
      method: "post",
      url: url,
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
}
async function createCustomToken(payload) {
  let url = config.FIREBASE_URL + "firebaseapi/createCustomToken";
  try {
    let res = await axios({
      method: "post",
      url: url,
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
}
async function updateUser(payload) {
  let url = config.FIREBASE_URL + "firebaseapi/updateUser";
  try {
    let res = await axios({
      method: "PATCH",
      url: url,
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
}
async function importUser(payload) {
  let url = config.FIREBASE_URL + "firebase-v1/importUser";
  try {
    let res = await axios({
      method: "POST",
      url: url,
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  createUser,
  createCustomToken,
  updateUser,
  importUser,
};
