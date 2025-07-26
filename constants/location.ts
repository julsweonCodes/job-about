export enum Location {
  TORONTO = "toronto",
  NORTH_YORK = "north_york",
  SCARBOROUGH = "scarborough",
  ETOBICOKE = "etobicoke",
  MISSISSAUGA = "mississauga",
  BRAMPTON = "brampton",
  VAUGHAN = "vaughan",
  RICHMOND_HILL = "richmond_hill",
  MARKHAM = "markham",
  THORNHILL = "thornhill",
  PICKERING = "pickering",
  AJAX = "ajax",
  WHITBY = "whitby",
  OSHAWA = "oshawa",
  OAKVILLE = "oakville",
  BURLINGTON = "burlington",
  MILTON = "milton",
  NEWHAMBURG = "newhamburg",
}

export const LOCATION_DISPLAY_NAMES: Record<Location, string> = {
  [Location.TORONTO]: "Toronto",
  [Location.NORTH_YORK]: "North York",
  [Location.SCARBOROUGH]: "Scarborough",
  [Location.ETOBICOKE]: "Etobicoke",
  [Location.MISSISSAUGA]: "Mississauga",
  [Location.BRAMPTON]: "Brampton",
  [Location.VAUGHAN]: "Vaughan",
  [Location.RICHMOND_HILL]: "Richmond Hill",
  [Location.MARKHAM]: "Markham",
  [Location.THORNHILL]: "Thornhill",
  [Location.PICKERING]: "Pickering",
  [Location.AJAX]: "Ajax",
  [Location.WHITBY]: "Whitby",
  [Location.OSHAWA]: "Oshawa",
  [Location.OAKVILLE]: "Oakville",
  [Location.BURLINGTON]: "Burlington",
  [Location.MILTON]: "Milton",
  [Location.NEWHAMBURG]: "New Hamburg",
} as const;

export const COMMON_LOCATIONS: Location[] = [
  Location.TORONTO,
  Location.NORTH_YORK,
  Location.SCARBOROUGH,
  Location.MISSISSAUGA,
  Location.BRAMPTON,
  Location.VAUGHAN,
];

export const getLocationDisplayName = (location: string | Location): string => {
  return LOCATION_DISPLAY_NAMES[location as Location] || location;
};

export const isCommonLocation = (location: Location): boolean => {
  return COMMON_LOCATIONS.includes(location);
};

export const convertLocationKeyToValue = (key: string): string => {
  const locationMap: Record<string, string> = {
    TORONTO: Location.TORONTO,
    NORTH_YORK: Location.NORTH_YORK,
    SCARBOROUGH: Location.SCARBOROUGH,
    ETOBICOKE: Location.ETOBICOKE,
    MISSISSAUGA: Location.MISSISSAUGA,
    BRAMPTON: Location.BRAMPTON,
    VAUGHAN: Location.VAUGHAN,
    RICHMOND_HILL: Location.RICHMOND_HILL,
    MARKHAM: Location.MARKHAM,
    THORNHILL: Location.THORNHILL,
    PICKERING: Location.PICKERING,
    AJAX: Location.AJAX,
    WHITBY: Location.WHITBY,
    OSHAWA: Location.OSHAWA,
    OAKVILLE: Location.OAKVILLE,
    BURLINGTON: Location.BURLINGTON,
    MILTON: Location.MILTON,
    NEWHAMBURG: Location.NEWHAMBURG,
  };
  return locationMap[key] || key;
};

export const getCommonLocationsWithDisplayNames = () => {
  return COMMON_LOCATIONS.map((location) => ({
    value: location,
    label: getLocationDisplayName(location),
  }));
};

export const getAllLocationsWithDisplayNames = () => {
  return Object.values(Location).map((location) => ({
    value: location,
    label: getLocationDisplayName(location),
  }));
};
