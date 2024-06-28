var Buffer = require('buffer/').Buffer;

const checkTokenExpiration = async (access_token: string) => {
  const accessTokenDetails = JSON.parse(
    Buffer.from(access_token.split('.')[1], 'base64').toString(),
  );

  const {exp} = accessTokenDetails;

  const expirationDate = new Date(exp * 1000);
  const currentDate = new Date();

  if (currentDate > expirationDate) {
    //if crossed
    return false;
  } else {
    //not crossed
    return true;
  }
};

export {checkTokenExpiration};
