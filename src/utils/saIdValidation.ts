
import { TEST_ACCOUNTS } from "@/constants/auth";

export const isTestAccount = (id: string) => {
  return Object.values(TEST_ACCOUNTS).includes(id);
};

export const isSaId = (input: string) => {
  if (isTestAccount(input)) return true;
  return /^\d+$/.test(input) && input.length === 13;
};

export const formatSaIdPassword = (id: string) => {
  return `Test${id}`;
};
