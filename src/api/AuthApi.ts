const MAIN_URL = `https://dummyjson.com`;

const loginHandler = async (username: string, password: string) => {
  const response = await fetch(`${MAIN_URL}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      username: username,
      password: password,
      expiresInMins: 30,
    }),
  });
  return response;
};

const getCurrentUser = async (token: string) => {
  const response = await fetch('https://dummyjson.com/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
    },
  });
  return response;
};

const getNewAccessToken = async (refreshToken: string) => {
  const response = await fetch('https://dummyjson.com/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: `${refreshToken}`,
      expiresInMins: 30,
    }),
  });

  return response;
};

export {loginHandler, getCurrentUser, getNewAccessToken};
