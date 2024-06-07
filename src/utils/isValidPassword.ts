export const isValidPassword = async (password: string) => {
  return (await hashedPassword(password)) === process.env.ADMIN_HASHED_PASSWORD;
};

const hashedPassword = async (password: string) => {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );

  return Buffer.from(arrayBuffer).toString("base64");
};
