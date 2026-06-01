import bcrypt from "bcryptjs";

export const hashPasssword = async (password: string) => {
  const salt = await bcrypt.genSalt(Number(process.env.PASSWORD_SALT_ROUNDS));
  return await bcrypt.hash(password, salt);
};

export const comnparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};
