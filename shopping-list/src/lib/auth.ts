import { jwtVerify } from 'jose';

interface UserJwtPayload {
  id: number;
 
  iat: number;
}

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error("Secret key does not exist");
  }
  return secret;
};

const isUserJwtPayload = (payload: any): payload is UserJwtPayload => {
  return (
    typeof payload.id === "number" &&
    typeof payload.iat === "number"
  );
};

export const verifyAuth = async (token: string): Promise<UserJwtPayload> => {
  try {
    console.log('Verifying Token:', token);
    const { payload } = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()));
    console.log('Token Payload:', payload);

    if (!isUserJwtPayload(payload)) {
      throw new Error("Invalid token payload");
    }

    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error("Your token has expired or is invalid");
  }
};
