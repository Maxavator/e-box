
import { TEST_ACCOUNTS } from "@/constants/auth";

type TestAccountValues = typeof TEST_ACCOUNTS[keyof typeof TEST_ACCOUNTS];

export const isTestAccount = (id: string): id is TestAccountValues => {
  const testValues = Object.values(TEST_ACCOUNTS) as TestAccountValues[];
  return testValues.includes(id as TestAccountValues);
};

export const isSaId = (input: string) => {
  if (isTestAccount(input)) return true;
  return /^\d+$/.test(input) && input.length === 13;
};

export const formatSaIdPassword = (id: string) => {
  return `Test${id}`;
};
