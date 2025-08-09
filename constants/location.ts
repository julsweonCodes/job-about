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

  // British Columbia
  VANCOUVER = "vancouver",
  SURREY = "surrey",
  VICTORIA = "victoria",
  BURNABY = "burnaby",
  KELOWNA = "kelowna",
  RICHMOND = "richmond",
  ABBOTSFORD = "abbotsford",
  LANGLEY = "langley",
  KAMLOOPS = "kamloops",
  NANAIMO = "nanaimo",
  NORTH_VANCOUVER = "north_vancouver",
  DELTA = "delta",
  PRINCE_GEORGE = "prince_george",
  COQUITLAM = "coquitlam",
  CHILLIWACK = "chilliwack",
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

  // British Columbia
  [Location.VANCOUVER]: "Vancouver",
  [Location.SURREY]: "Surrey",
  [Location.VICTORIA]: "Victoria",
  [Location.BURNABY]: "Burnaby",
  [Location.KELOWNA]: "Kelowna",
  [Location.RICHMOND]: "Richmond",
  [Location.ABBOTSFORD]: "Abbotsford",
  [Location.LANGLEY]: "Langley",
  [Location.KAMLOOPS]: "Kamloops",
  [Location.NANAIMO]: "Nanaimo",
  [Location.NORTH_VANCOUVER]: "North Vancouver",
  [Location.DELTA]: "Delta",
  [Location.PRINCE_GEORGE]: "Prince George",
  [Location.COQUITLAM]: "Coquitlam",
  [Location.CHILLIWACK]: "Chilliwack",
} as const;

// Province for each location
export const LOCATION_PROVINCE: Record<Location, "ON" | "BC"> = {
  // Ontario
  [Location.TORONTO]: "ON",
  [Location.NORTH_YORK]: "ON",
  [Location.SCARBOROUGH]: "ON",
  [Location.ETOBICOKE]: "ON",
  [Location.MISSISSAUGA]: "ON",
  [Location.BRAMPTON]: "ON",
  [Location.VAUGHAN]: "ON",
  [Location.RICHMOND_HILL]: "ON",
  [Location.MARKHAM]: "ON",
  [Location.THORNHILL]: "ON",
  [Location.PICKERING]: "ON",
  [Location.AJAX]: "ON",
  [Location.WHITBY]: "ON",
  [Location.OSHAWA]: "ON",
  [Location.OAKVILLE]: "ON",
  [Location.BURLINGTON]: "ON",
  [Location.MILTON]: "ON",
  [Location.NEWHAMBURG]: "ON",

  // British Columbia
  [Location.VANCOUVER]: "BC",
  [Location.SURREY]: "BC",
  [Location.VICTORIA]: "BC",
  [Location.BURNABY]: "BC",
  [Location.KELOWNA]: "BC",
  [Location.RICHMOND]: "BC",
  [Location.ABBOTSFORD]: "BC",
  [Location.LANGLEY]: "BC",
  [Location.KAMLOOPS]: "BC",
  [Location.NANAIMO]: "BC",
  [Location.NORTH_VANCOUVER]: "BC",
  [Location.DELTA]: "BC",
  [Location.PRINCE_GEORGE]: "BC",
  [Location.COQUITLAM]: "BC",
  [Location.CHILLIWACK]: "BC",
} as const;

// Build full label like "Markham, ON"
export const getLocationLabel = (location: Location): string => {
  return `${LOCATION_DISPLAY_NAMES[location]}, ${LOCATION_PROVINCE[location]}`;
};

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

// Map to options for dropdowns
export const getAllLocationsWithLabels = () => {
  return Object.values(Location).map((loc) => ({
    value: loc,
    label: getLocationLabel(loc),
  }));
}

export const getCommonLocationsWithLabels = () =>
  COMMON_LOCATIONS.map((loc) => ({
    value: loc,
    label: getLocationLabel(loc),
  }));