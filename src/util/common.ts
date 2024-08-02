export const capitalizeFirstLetter = (string: string) => {
  const splitStr = string?.toLowerCase()?.split(" ");
  for (let i = 0; i < splitStr?.length; i++) {
    splitStr[i] =
      splitStr[i]?.charAt(0)?.toUpperCase() + splitStr[i]?.substring(1);
  }
  return splitStr?.join(" ");
};

export const numberFormat = (value: number | undefined, digits: number) => {
  return value?.toLocaleString("en", { minimumFractionDigits: digits })
}

export const chipsFormat = (chip: number) => {
  if (chip >= 1_000_000) {
    return (chip / 1_000_000) + 'M';
  } else if (chip >= 1_000) {
    return (chip / 1_000) + 'K';
  } else {
    return chip.toString();
  }
}