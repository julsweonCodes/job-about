export const getEnumKeyFromValue = <T extends Record<string, string>>(
    enumObj: T,
    value: string
): keyof T | undefined => {
    return Object.keys(enumObj).find(
        (key) => enumObj[key as keyof T] === value
    ) as keyof T | undefined;
};