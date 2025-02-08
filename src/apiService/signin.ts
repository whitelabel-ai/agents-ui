import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const post = async (payload?: any) => {

  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cognito/signin`, payload).catch((error) => ({data: error}));

  return response.data;
};

export const signin = {
  post,
};
