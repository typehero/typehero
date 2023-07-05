/**
 * This is the fence that a challenge starts with
 * @deprecated this doesn't even make sense because it's probably always 0
 */
export const TEST_CASE_START = '// TEST CASE START';

/**
 * This is the fence signifies where users code starts
 */
export const USER_CODE_START = '// CODE START';

export const USER_CODE_START_REGEX = new RegExp(`\n${USER_CODE_START}`);
