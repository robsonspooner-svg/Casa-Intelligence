/**
 * Registry mapping LGA names to their ArcGIS planning scheme endpoints.
 * Used by the QLD-wide zoning and overlay APIs to route queries to the correct council.
 *
 * Covers 7 SEQ councils (~95% of subdivision opportunity):
 * - Sunshine Coast, Brisbane, Gold Coast, Moreton Bay, Logan, Redland, Noosa
 *
 * Councils without public endpoints (Ipswich, Toowoomba) fall back to
 * "may be subdividable" with the Subdivide button still available.
 */

export interface LGAZoningConfig {
  url: string;
  nameField: string;
  codeField: string;
  precinctField?: string;
  localPlanField?: string;
  categoryField?: string;
  /** Some endpoints (Moreton Bay, Logan) don't support point geometry — use envelope */
  useEnvelope?: boolean;
}

export interface LGAEndpoints {
  zoning: LGAZoningConfig | null;
  overlays: {
    baseUrl: string;
    layers: { id: number; name: string; bucket: string }[];
  } | null;
}

// LGA boundary lookup endpoint (state-wide) — Layer 11 = Local Government Area
export const LGA_BOUNDARY_URL =
  'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/AdminBoundariesFramework/MapServer/11/query';

// State-wide overlay endpoints (work across all LGAs)
export const STATE_WIDE_OVERLAYS = {
  flood: {
    url: 'https://gisservices.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/FMPDefinedFloodArea/MapServer/0/query',
    name: 'Flood Mapping Area',
    bucket: 'flood',
  },
  bushfire: {
    url: 'https://gisservices.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/BushfireProneArea/MapServer/0/query',
    name: 'Bushfire Prone Area',
    bucket: 'bushfire',
  },
  heritage: {
    url: 'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/CulturalHeritageBoundaries/MapServer/10/query',
    name: 'Queensland Heritage Register',
    bucket: 'heritage',
  },
  koala: {
    url: 'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/EnvironmentalBoundaries/MapServer/0/query',
    name: 'Koala Habitat Area',
    bucket: 'environment',
  },
  vegetation: {
    url: 'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/EnvironmentalBoundaries/MapServer/3/query',
    name: 'Regulated Vegetation Management',
    bucket: 'biodiversity',
  },
  wetlands: {
    url: 'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/EnvironmentalBoundaries/MapServer/6/query',
    name: 'Wetland Protection Area',
    bucket: 'wetlands',
  },
  coastal: {
    url: 'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Boundaries/EnvironmentalBoundaries/MapServer/9/query',
    name: 'Coastal Management District',
    bucket: 'coastal',
  },
};

// Council-specific planning scheme endpoints
const LGA_ENDPOINTS: Record<string, LGAEndpoints> = {
  'SUNSHINE COAST REGIONAL': {
    zoning: {
      url: 'https://services-ap1.arcgis.com/YQyt7djuXN7rQyg4/arcgis/rest/services/PlanningScheme_Zoning_SCC/FeatureServer/5/query',
      nameField: 'LABEL',
      codeField: 'ZONE_CODE',
      precinctField: 'PRECINCT',
      localPlanField: 'LOCAL_PLAN',
      categoryField: 'HEADING',
    },
    overlays: {
      baseUrl: 'https://services-ap1.arcgis.com/YQyt7djuXN7rQyg4/arcgis/rest/services/PlanningScheme_SunshineCoast_Overlays_SCC_OpenData/FeatureServer',
      layers: [
        { id: 0, name: 'Acid Sulfate Soils', bucket: 'environment' },
        { id: 32, name: 'High Bushfire Hazard Area', bucket: 'bushfire' },
        { id: 33, name: 'High Bushfire Hazard Area Buffer', bucket: 'bushfire' },
        { id: 34, name: 'Medium Bushfire Hazard Area', bucket: 'bushfire' },
        { id: 46, name: 'Flooding and Inundation Area', bucket: 'flood' },
        { id: 47, name: 'Drainage Deficient Areas', bucket: 'flood' },
        { id: 37, name: 'Coastal Protection Area', bucket: 'coastal' },
        { id: 49, name: 'Specific Site Note (Height)', bucket: 'height' },
        { id: 50, name: 'Maximum Height of Buildings and Structures', bucket: 'height' },
        { id: 52, name: 'Local Heritage Place (Shipwreck)', bucket: 'heritage' },
        { id: 53, name: 'State Heritage Place', bucket: 'heritage' },
        { id: 54, name: 'Local Heritage Place', bucket: 'heritage' },
        { id: 55, name: 'Land In Proximity to a Local Heritage Place', bucket: 'heritage' },
        { id: 56, name: 'Character Building', bucket: 'character' },
        { id: 57, name: 'Character Area', bucket: 'character' },
        { id: 58, name: 'Landslide Hazard Area', bucket: 'landslide' },
        { id: 59, name: 'Steep Land (Slope)', bucket: 'slope' },
        { id: 24, name: 'Waterways', bucket: 'waterways' },
        { id: 26, name: 'Riparian Protection Area', bucket: 'waterways' },
        { id: 27, name: 'Ramsar Wetlands', bucket: 'wetlands' },
        { id: 28, name: 'Wetlands', bucket: 'wetlands' },
        { id: 30, name: 'Native Vegetation Area', bucket: 'biodiversity' },
        { id: 62, name: 'High Voltage Electricity Line and Buffer (Distribution)', bucket: 'infrastructure' },
        { id: 63, name: 'High Voltage Electricity Line and Buffer (Transmission)', bucket: 'infrastructure' },
        { id: 70, name: 'Scenic Route', bucket: 'scenic' },
      ],
    },
  },

  'BRISBANE CITY': {
    zoning: {
      url: 'https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/Zoning_opendata/FeatureServer/0/query',
      nameField: 'LVL2_ZONE',
      codeField: 'ZONE_CODE',
      precinctField: 'NP_PREC',
      categoryField: 'LVL1_ZONE',
    },
    overlays: null,
  },

  'GOLD COAST CITY': {
    zoning: {
      url: 'https://services-ap1.arcgis.com/lnVW0dLI3fvST2hd/arcgis/rest/services/City_Plan_Version_13_Open_Data/FeatureServer/4/query',
      nameField: 'ZONE',
      codeField: 'ZONE',
      categoryField: 'LVL1_ZONE',
    },
    overlays: null,
  },

  'MORETON BAY CITY': {
    zoning: {
      url: 'https://services-ap1.arcgis.com/152ojN3Ts9H3cdtl/arcgis/rest/services/ZM_Zones_Dissolved_WebMercator_OpenData/FeatureServer/0/query',
      nameField: 'LVL1_ZONE',
      codeField: 'LVL1_ZONE',
      precinctField: 'LP_PREC',
      useEnvelope: true,
    },
    overlays: null,
  },

  'LOGAN CITY': {
    zoning: {
      url: 'https://arcgis.lcc.wspdigital.com/server/rest/services/LoganHub/Logan_Planning_Scheme_v9_2_TLPI_No_1_2024_20250527/MapServer/368/query',
      nameField: 'Zone',
      codeField: 'Zone',
      useEnvelope: true,
    },
    overlays: null,
  },

  'REDLAND CITY': {
    zoning: {
      url: 'https://gis.redland.qld.gov.au/arcgis/rest/services/planning/city_plan/MapServer/44/query',
      nameField: 'QPP_Description',
      codeField: 'QPP_Zone',
      precinctField: 'QPP_Precinct',
    },
    overlays: null,
  },

  'NOOSA SHIRE': {
    zoning: {
      url: 'https://services2.arcgis.com/tQg86iShPXJPWQWw/arcgis/rest/services/DSP_Noosa_Plan_Zones/FeatureServer/0/query',
      nameField: 'New_Noosa_Plan_Zones',
      codeField: 'New_Noosa_Plan_Zones',
    },
    overlays: null,
  },
};

export function getLGAEndpoints(lgaName: string): LGAEndpoints | null {
  const key = lgaName.toUpperCase().trim();
  return LGA_ENDPOINTS[key] || null;
}

/**
 * Build the geometry parameter for an ArcGIS query.
 * Some services (Moreton Bay, Logan) don't support point geometry
 * and require an envelope (small bbox around the point).
 */
export function buildGeometryParams(
  lat: number,
  lng: number,
  useEnvelope: boolean
): { geometry: string; geometryType: string } {
  if (useEnvelope) {
    const d = 0.0005; // ~55m buffer
    return {
      geometry: JSON.stringify({ xmin: lng - d, ymin: lat - d, xmax: lng + d, ymax: lat + d }),
      geometryType: 'esriGeometryEnvelope',
    };
  }
  return {
    geometry: `${lng},${lat}`,
    geometryType: 'esriGeometryPoint',
  };
}
