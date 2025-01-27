import moment from 'moment-timezone';

// this should match the backend limit(record per page)
export const ROW_PER_PAGE = 50;

// will refine for better structure
export const FEATURE_CONFIG = {
  ADMIN_PANEL_EDIT: {
    access_group: ['admin', 'marketing'],
  },
  ADMIN_PANEL_ARCHIVE: {
    access_group: ['admin', 'marketing'],
  },
  ADMIN_PANEL_ACTIVATE: {
    access_group: ['admin', 'marketing'],
  },
  SA_ONLY: {
    access_group: ['solutions architect'],
  },
  ADMIN_AND_SA_ONLY: {
    access_group: ['admin', 'solutions architect'],
  },
};

export const SIDE_PANEL_POSITION = ['left', 'right', 'top', 'bottom'];
export const SIDE_PANEL_OPTIONS = ['Option01', 'Option02', 'Option03', 'Option04'];

export const DEFAULT_VIEW_STATE = {
  longitude: -98.0,
  latitude: 38.5,
  zoom: 2,
};

export const DEFAULT_ZOOM = 15;

export const DEFAULT_MAP_STYLES = {
  width: '100%',
  height: 'calc(100vh - 5px)',
  mapboxStyle: 'mapbox://styles/songzzh3/cli37izdn00us01q1c1475f3e', // need to replace this with you own copy of the map style
};

export const BUTTON_STYLE = {
  CONTAINED_STYLE: 'contained_style',
  BORDERLESS_ICON_STYLE: 'borderless_style',
  DIV_STYLE: 'div_style',
  OUTLINED_DIV_STYLE: 'outlined_div_style',
  MINI_OUTLINED_DIV_STYLE: 'mini_outlined_div_style',
  ICON_BUTTON: 'icon_button',
  END_ICON_BUTTON: 'icon_button',
  USE_CASE_STYLE: 'use_case_style',
  DISCOVER_REGION_REMOVE_STYLE: 'discover_region_remove_style',
  DISCOVER_REGION_ADD_CLOUDS_REMOVE_STYLE: 'discover_region_add_clouds_remove_style',
  COMPANY_STYLE: 'company_style',
  INDUSTRY_VERTICAL_STYLE: 'industry_vertical_style',
  ROUNDED_STYLE: 'rounded_style',
  ROUNDED_LIGHT_STYLE: 'rounded_light_style',
  ROUNDED_LIGHT_DIV_STYLE: 'rounded_light_div_style',
  BORDERLESS_START_ICON_STYLE: 'borderless_start_icon_style',
  DIV_STYLE_TEXT_BUTTON: 'div_style_text_button',
  BORDERLESS_END_ICON_TEXT_BUTTON: 'borderless_end_icon_text_button',
};

export const BUTTON_ICON = {
  ADD: 'add',
  ADD_BORDERLESS: 'add borderless',
  ADD_OUTLINED: 'add outlined',
  ARROW: 'arrow',
  CANCEL: 'cancel',
  CLOUD_UPLOAD_ICON: 'CloudUploadOutlinedIcon',
  EDIT: 'edit',
  FILE_DOWNLOAD: 'FileDownloadOutlinedIcon',
  FILTER: 'filter',
  FILTER_OUTLINED: 'filter outlined',
  KEYBOARD_ARROW_DOWN: 'KeyboardArrowDown',
  KEYBOARD_ARROW_UP: 'KeyboardArrowUp',
  KEYBOARD_ARROW_RIGHT: 'KeyboardArrowRight',
  LIGHTBULB: 'LightbulbOutlinedIcon',
  LINK: 'link',
  REMOVE_CIRCLE_OUTLINED_ICON: 'RemoveCircleOutlinedIcon',
  REMOVE: 'remove',
  SAVE: 'save',
  SEARCH: 'search',
  DOWNLOAD: 'download',
};

export const TABS = {
  CLIENT_PORTFOLIO: 'Client Portfolio',
  MY_ACCOUNT: 'My Account',
  USER_MANAGEMENT: 'User Management',
  USE_CASES: 'Use Cases',
  LOGOFF: 'Logoff',
  ACTIVE_INDUSTRY_VERTICAL: 'Active',
  ACTIVE_USER: 'Active Users',
  ACTIVE_USE_CASE: 'Active',
  ARCHIVED_USER: 'Archived Users',
  ARCHIVED_COMPANIES: 'Archived Companies',
  ARCHIVED_ARTIFACT: 'Archived Artifact',
  ARCHIVES: 'Archives',
  MY_COMPANIES: 'My Companies',
  ALL_COMPANIES: 'All Companies',
  DR_TEAM: 'DR Team',
  CUSTOMER_CONTACT: 'Customer Contact',
  ADMIN_PANEL: 'Admin Panel',
  INDUSTRY_VERTICALS: 'Industry Verticals',
  CONFIGURATION: 'Configuration',
  MARKETING: 'Marketing',
  REFERENCE_ARCHITECTURE: 'Reference Architecture',
  BRIEFS: 'Briefs',
  ICONS: 'Icons',
  DISCOVER: 'Discover',
  MODEL: 'Model',
  GENERATE: 'Generate',
  PROJECTS: 'Projects',
  LIBRARY: 'Library',
  PROJECT_DETAILS: 'Project Summary',
  PROJECT_BRIEFCASE: 'Project Briefcase',
  SOLUTION_BRIEF: 'Solution Brief',
  REGIONS: 'Regions',
  INITIAL_REGIONS: 'Initial Regions',
  CURRENT_STATE: 'Current State',
  FUTURE_STATE: 'Add Future State',
  MODEL_MODEL: 'Model',
  MODEL_CONNECT: 'Connect',
};

export const SUB_TABS = {
  INITIAL_REGIONS: 'Initial Regions',
  STATE_VIEW: 'State View',
};

export const REGIONS_INNER_TABS = {
  CURRENT_STATE: 'Current State',
  FUTURE_STATE: 'Add Future State',
};

export const DISCOVER_REGION_STATE_TABS = {
  COMPLIANCE: 'Compliance',
  DATA_CENTRES: 'Data Centers',
  CLOUDS: 'Clouds',
  APPLICATIONS: 'Applications',
  PARTNERSHIP_AND_SUPPLIERS: 'Partnership/Suppliers',
  CUSTOMER_LOCATIONS: 'Customer Locations',
};

export const DISCOVER_REGION_FIELDS = {
  COMPLIANCE: 'compliances',
  DATA_CENTRES: 'datacenters',
  CLOUDS: 'clouds',
  APPLICATIONS: 'applications',
  PARTNERSHIP_AND_SUPPLIERS: {
    PARTNERSHIP_AND_SUPPLIERS: 'partnersuppliers',
    NSP: 'nsp',
    VAR: 'var',
    SW: 'sw',
    MIGRATION: 'migration',
    HW: 'hw',
  },
  CUSTOMER_LOCATIONS: 'customerlocations',
};

export const MODEL_DETAIL_TYPE = 'model';

export const DISCOVER_REGION_TABS_LINKED_TO_DETAIL_TYPE = {
  [DISCOVER_REGION_STATE_TABS.COMPLIANCE]: DISCOVER_REGION_FIELDS.COMPLIANCE,
  [DISCOVER_REGION_STATE_TABS.DATA_CENTRES]: DISCOVER_REGION_FIELDS.DATA_CENTRES,
  [DISCOVER_REGION_STATE_TABS.CLOUDS]: DISCOVER_REGION_FIELDS.CLOUDS,
  [DISCOVER_REGION_STATE_TABS.APPLICATIONS]: DISCOVER_REGION_FIELDS.APPLICATIONS,
  // This is an anomaly with the customer view, items in the partner view tab are listed
  // by the notes for each kind of partner (nsp, var, etc)
  [DISCOVER_REGION_STATE_TABS.PARTNERSHIP_AND_SUPPLIERS]: 'notes',
  [DISCOVER_REGION_STATE_TABS.CUSTOMER_LOCATIONS]: DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS,
};

export const DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS = {
  NSP: 'Network Service Provider',
  VAR: 'Value Added Reseller',
  SW: 'Software Vendors',
  MIGRATION: 'Migration',
  HW: 'Hardware Vendors',
};

export const DISCOVER_REGION_SIDE_PANEL_APPLICATION = {
  SET_ALL: 'set all',
  REMOVE_ALL: 'remove all',
  TOGGLE_SELECTED: 'toggle selected',
};

export const DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES = {
  CLOUD: 'cloud',
  DATA_CENTER: 'dataCenter',
};

export const PATH_NAME = {
  CLIENT_PORTFOLIO: '/client-portfolio',
  MY_COMPANIES: '/my-companies',
  COMPANY_ARCHIVES: '/archives',
  USER_PROFILE: '/user-profile',
  USER_MANAGEMENT: '/user-management',
  USER_MANAGEMENT_ARCHIVES: '/archives',
  USE_CASES: '/use-cases',
  USE_CASES_ARCHIVES: '/archives',
  INDUSTRY_VERTICALS: '/industry-verticals',
  INDUSTRY_VERTICALS_ARCHIVES: '/archives',
  ARTIFACT_LIBRARY: '/artifact-library',
  VISUALIZER: '/visualizer',
  YOUR_PROJECT: '/your-project',
  PROJECT_MODELER_BASE: '/project-modeler',
  MODEL: '/model',
  MODEL_CONNECT: '/connect',
  PROJECT_BRIEFCASE: '/project-briefcase',
  SOLUTION_BRIEFCASE: '/solution-briefcase',
  LIBRARY: '/library',
  PROJECT_MODELER_REGION: '/region',
  REGION_STATE_TABS: {
    COMPLIANCE: '/compliance',
    DATA_CENTERS: '/data-centers',
    CLOUDS: '/clouds',
    APPLICATIONS: '/applications',
    PARTNERSHIP_SUPPLIERS: '/partnership-and-suppliers',
    CUSTOMER_LOCATIONS: '/customer-locations',
  },
  LIBRARY_TABS: {
    MARKETING: '/marketing',
    REFERENCE_ARCHITECTURE: '/reference-architecture',
    BRIEFS: '/briefs',
    ICONS: '/icons',
    ARCHIVES: '/archives',
  },
};

// for refining active panel later
export const PANELS = {
  TYPE: 'Type',
  INDUSTRY_VERTICAL: 'Industry Vertical',
  USE_CASE: 'UseCases',
  PARTNER: 'Partner',
  TECHNOLOGY: 'Technology',
  HUB: 'Hub',
  OTHER_TAGS: 'Other Tags',
};

export const EDIT_MODE = {
  EDIT_USER: 'edit user',
  EDIT_SELF: 'edit self',
  EDIT_COMPANY: 'edit company',
  EDIT_PROJECT: 'edit project',
  EDIT_USE_CASE: 'edit use case',
  EDIT_INDUSTRY_VERTICAL: 'edit industry vertical',
  EDIT_MARKETING: 'edit marketing',
  EDIT_REFERENCE: 'edit reference',
  EDIT_BRIEFS: 'edit briefs',
  EDIT_ICON: 'edit icon',
  EDIT_PROJECT_BRIEFCASE: 'edit project briefcase',
  EDIT_SOLUTION_BRIEF: 'edit solution brief',
  EDIT_REGION_COMPLIANCE: 'edit region compliance',
  EDIT_REGION_DATA_CENTRE: 'edit region data centre',
  EDIT_REGION_CLOUDS: 'edit region clouds',
  EDIT_REGION_APPLICATIONS: 'edit region applications',
  EDIT_REGION_PARTNERSHIP_AND_SUPPLIERS: 'edit region partnership and suppliers',
  EDIT_REGION_CUSTOMER_LOCATIONS: 'edit customer locations',
};

export const DETAILS_MODE = {
  COMPANY_DETAILS: 'company details',
};

export const Roles = ['customer', 'admin', 'solutions engineer', 'solutions architect', 'marketing', 'sales'];

export const AllRoles = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  SOLUTIONS_ARCHITECT: 'solutions architect',
  SOLUTIONS_ENGINEER: 'solutions engineer',
  MARKETING: 'marketing',
  SALES: 'sales',
};

export const MARKETING_DOCUMENT_FILE_TYPES = ['PPT', 'PPTX', 'DOC', 'DOCX', 'PDF', 'TXT', 'XLS', 'XLSX', 'CSV', 'VSD', 'VSDX'];
export const MARKETING_DOCUMENT_FILE_VALUES = [
  { type: 'PPT', maxSize: '10mb' },
  { type: 'PPTX', maxSize: '10mb' },
  { type: 'DOC', maxSize: '10mb' },
  { type: 'DOCX', maxSize: '10mb' },
  { type: 'PDF', maxSize: '10mb' },
  { type: 'TXT', maxSize: '10mb' },
  { type: 'XLS', maxSize: '10mb' },
  { type: 'XLSX', maxSize: '10mb' },
  { type: 'CSV', maxSize: '10mb' },
  { type: 'VSD', maxSize: '10mb' },
  { type: 'VSDX', maxSize: '10mb' },
];

export const ICON_FILE_TYPES = ['JPG', 'JPEG', 'PNG', 'GIF', 'SVG', 'BMP'];
export const ICON_FILE_VALUES = [
  { type: 'JPEG', maxSize: '2mb' },
  { type: 'PNG', maxSize: '2mb' },
];

export const SOLUTION_BRIEF_FILE_TYPES = ['PDF'];
export const SOLUTION_BRIEF_FILE_VALUES = [
  { type: 'DOCX', maxSize: '10mb' },
  { type: 'PDF', maxSize: '10mb' },
  { type: 'TXT', maxSize: '10mb' },
];

export const SEARCH_DEBOUNCE_TIME = 1000;

export const FOCUS_HUB_VALUE_LABELS = {
  NETWORK: 'network',
  COMPUTE: 'compute',
  STORAGE: 'storage',
};

export const REGION_SELECTION_HUB = {
  ALL_REGIONS: 'All Regions (Global)',
  NORTH_AMERICA: 'North America',
  EUROPE: 'Europe',
  CHINA: 'China',
};

export const HOSTING_PREFERNCES = ['Digital Realty hosted', 'On premise', 'Hosted by third party'];

export const OFFICE_TYPES = ['Headquarters', 'Branch', 'Key Office'];

export const PHYSICAL_PREFERENCES = ['Let Digital Realty choose', 'Temp 1', 'Temp 2'];

// be careful when changing these as they are involved for handling selected options
export const FILTER_FACET_INITIAL_NUMBER = 4;
export const FILTER_FACET_CATEGORY = {
  TAG: 'Tag',
  TYPE: 'Type',
  INDUSTRY_VERTICAL: 'Vertical',
  USE_CASE: 'Use Case',
  PARTNER: 'Partner',
  TECHNOLOGY: 'Technology',
  HUB: 'Hub',
  ROLE: 'Role',
  OTHER_TAGS: 'Other Tags',
};

export const FILTER_MODE = {
  ARTIFACT_MARKETING: 'artifact marketing',
  ARTIFACT_REFERENCE: 'artifact reference',
  ARTIFACT_ICON: 'artifact icon',
};

export const ICON_DISCOVER_MODEL_VALUES = [
  {
    id: '1',
    name: 'Compliance',
    apiValue: 'compliances',
  },
  {
    id: '2',
    name: 'Data Center (DR Data Center, On Premise, Third Party)',
    apiValue: 'datacenters',
  },
  {
    id: '3',
    name: 'Cloud / Cloud Region',
    apiValue: 'clouds',
  },
  {
    id: '4',
    name: 'Cloud onramp',
    apiValue: 'onramps',
  },
  {
    id: '5',
    name: 'Cloud Services (Storage, Network, Compute)',
    apiValue: 'services',
  },
  {
    id: '6',
    name: 'Applications',
    apiValue: 'applications',
  },
  {
    id: '7',
    name: 'Partners/Suppliers - NSP',
    apiValue: 'partnernsp',
  },
  {
    id: '8',
    name: 'Partners/Suppliers - VAR',
    apiValue: 'partnervar',
  },

  {
    id: '9',
    name: 'Partners/Suppliers - SW',
    apiValue: 'partnersw',
  },
  {
    id: '10',
    name: 'Partners/Suppliers - Migration',
    apiValue: 'partnermig',
  },
  {
    id: '11',
    name: 'Partners/Suppliers - HW Vendors',
    apiValue: 'partnerhw',
  },
  {
    id: '12',
    name: 'Customer Location (Headquarter, Branch office, Key office',
    apiValue: 'offices',
  },
  {
    id: '13',
    name: 'Technology Icons',
    apiValue: 'technology',
  },
  {
    id: '14',
    name: 'Generic',
    apiValue: 'generic',
  },
];

export const TECHNOLOGY_ICON_TAG = 'technology';

export const COMPANY_TABLE_COLUMN_CONFIG = [
  { id: 'companyName', label: 'Company Name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  { id: 'projects', label: 'Projects', align: 'left', minWidth: 60 },
  {
    id: 'creator',
    label: 'Creator',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'createdAt',
    label: 'Created',
    minWidth: 100,
    align: 'left',
    format: value => moment(value).tz('America/Vancouver').format('MMM DD, YY'),
  },
  {
    id: 'updatedAt',
    label: 'Last Updated',
    minWidth: 100,
    align: 'left',
    format: value => moment(value).tz('America/Vancouver').format('MMM DD, YY'),
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

export const ASSOCIATED_COMPANY_TABLE_COLUMN_CONFIG = [
  { id: 'companyName', label: 'Company Name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  { id: 'projects', label: 'Projects', align: 'left', minWidth: 60 },
  {
    id: 'creator',
    label: 'Creator',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 60,
    align: 'right',
  },
];

export const USE_CASE_TABLE_COLUMN_CONFIG = [
  { id: 'useCaseName', label: 'Use Case Name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  { id: 'projects', label: 'Projects', align: 'left', minWidth: 60 },
  {
    id: 'documents',
    label: 'Docs',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

export const ARCHIVED_USE_CASE_TABLE_COLUMN_CONFIG = [
  { id: 'useCaseName', label: 'Use Case Name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  {
    id: 'documents',
    label: 'Docs',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

export const ACTIVE_INDUSTRY_VERTICAL_TABLE_COLUMN_CONFIG = [
  { id: 'industryVerticalName', label: 'Industry Vertical name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  { id: 'companies', label: 'Companies', align: 'left', minWidth: 60 },
  {
    id: 'documents',
    label: 'Docs',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

export const ARCHIVED_INDUSTRY_VERTICAL_TABLE_COLUMN_CONFIG = [
  { id: 'industryVerticalName', label: 'Industry Vertical name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  {
    id: 'documents',
    label: 'Docs',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

export const MARKETING_TABLE_COLUMN_CONFIG = [
  { id: 'documentName', label: 'Document Name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  { id: 'lastUpdated', label: 'Last Updated', align: 'left', minWidth: 60, format: value => moment(value).tz('America/Vancouver').format('MMM DD, YYYY') },
  {
    id: 'modifiedBy',
    label: 'Modified By',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'fileType',
    label: 'File Type',
    minWidth: 150,
    maxWidth: 200,
    align: 'left',
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

export const PROJECT_BRIEFCASE_TABLE_COLUMN_CONFIG = [
  { id: 'documentName', label: 'File Name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  {
    id: 'createdBy',
    label: 'Creator',
    minWidth: 150,
    align: 'left',
  },
  { id: 'dateAdded', label: 'Date Added', align: 'left', minWidth: 60, format: value => moment(value).tz('America/Vancouver').format('MMM DD, YYYY') },

  {
    id: 'size',
    label: 'Size',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

export const REFERENCE_TABLE_COLUMN_CONFIG = [
  { id: 'documentName', label: 'Document Name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  { id: 'lastUpdated', label: 'Last Updated', align: 'left', minWidth: 60, format: value => moment(value).tz('America/Vancouver').format('MMM DD, YYYY') },
  {
    id: 'modifiedBy',
    label: 'Modified By',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'fileType',
    label: 'File Type',
    minWidth: 150,
    maxWidth: 200,
    align: 'left',
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

export const BRIEF_TABLE_COLUMN_CONFIG = [
  { id: 'documentName', label: 'Document Name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  { id: 'lastUpdated', label: 'Last Updated', align: 'left', minWidth: 60, format: value => moment(value).tz('America/Vancouver').format('MMM DD, YYYY') },
  {
    id: 'customer',
    label: 'Customer',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'modifiedBy',
    label: 'Modified By',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'project',
    label: 'Project',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'download',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

export const SOLUTION_BRIEF_TABLE_COLUMN_CONFIG = [
  {
    id: 'version',
    label: 'Version',
    minWidth: 100,
    align: 'left',
  },
  {
    id: 'createdBy',
    label: 'Author',
    minWidth: 150,
    align: 'left',
  },
  { id: 'documentName', label: 'File Name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  {
    id: 'notes',
    label: 'Notes',
    minWidth: 250,
    align: 'left',
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

export const YOUR_PROJECT_TABLE_COLUMN_CONFIG = [
  { id: 'projectName', label: 'Project Name', minWidth: 400, rowCollapsible: true, fontWeight: 600 },
  { id: 'members', label: 'Members', align: 'center', minWidth: 60 },
  {
    id: 'user',
    label: 'User',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'createdAt',
    label: 'Date Created',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'updatedAt',
    label: 'Date Modified',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'moreMenu',
    label: '',
    minWidth: 80,
    align: 'right',
  },
];

const COMPLIANCE_TYPE = 'compliances';
export const OFFICE_TYPE = 'offices';
export const DATACENTER_TYPE = 'datacenters';
export const CLOUD_TYPE = 'clouds';
export const ONRAMP_TYPE = 'onramps';
export const GLOBAL_ONRAMP_TYPE = 'globalonramp';
export const REGIONAL_ONRAMP_TYPE = 'regionalonramp';
export const SERVICES_TYPE = 'services';
const APPLICATION_TYPE = 'applications';
const PARTNER_TYPE = 'partners';
const NETWORK_TYPE = 'networks';
const DATA_TYPE = 'data';
const CONTROL_TYPE = 'controls';
export const GENERIC_TYPE = 'generic';
export const REGION_TYPE = 'regions';

export const TAG_TYPES = [
  COMPLIANCE_TYPE,
  OFFICE_TYPE,
  DATACENTER_TYPE,
  CLOUD_TYPE,
  ONRAMP_TYPE,
  SERVICES_TYPE,
  APPLICATION_TYPE,
  PARTNER_TYPE,
  NETWORK_TYPE,
  DATA_TYPE,
  CONTROL_TYPE,
  GENERIC_TYPE,
];

export const TYPE_OPTIONS = [
  { id: 'type-01', name: 'Sales Representation' },
  { id: 'type-02', name: 'Brochure' },
  { id: 'type-03', name: 'White Paper' },
  { id: 'type-04', name: 'Analyst Report' },
  { id: 'type-05', name: 'Use Case' },
  { id: 'type-06', name: 'Infographic' },
  { id: 'type-07', name: 'Fact Sheet' },
  { id: 'type-08', name: 'Competitor Comparison' },
  { id: 'type-09', name: 'Case Study' },
];

export const PARTNER_OPTIONS = [
  { id: 'partner-01', name: 'AWS' },
  { id: 'partner-02', name: 'Oracle' },
  { id: 'partner-03', name: 'Amazon' },
  { id: 'partner-04', name: 'Ali Baba' },
  { id: 'partner-05', name: 'Microsoft' },
  { id: 'partner-06', name: 'IBM' },
  { id: 'partner-07', name: 'Google' },
  { id: 'partner-08', name: 'Verizon' },
];

export const TECHNOLOGY_OPTIONS = [
  { id: 'tech-01', name: '5G' },
  { id: 'tech-02', name: 'Artificial Intelligence' },
  { id: 'tech-03', name: 'Machine Learning' },
  { id: 'tech-04', name: 'Telecommunications' },
  { id: 'tech-05', name: 'MPLS' },
  { id: 'tech-06', name: 'IPVPN' },
  { id: 'tech-07', name: 'Peering' },
  { id: 'tech-08', name: 'Transit' },
  { id: 'tech-09', name: 'Solid State Drive' },
  { id: 'tech-10', name: 'Liquid Cooling' },
  { id: 'tech-11', name: 'Biometrics' },
  { id: 'tech-12', name: 'IPv6' },
  { id: 'tech-13', name: 'HPC' },
];

export const HUB_OPTIONS = [
  { id: 'hub-01', name: 'Network' },
  { id: 'hub-02', name: 'Data' },
  { id: 'hub-03', name: 'Control' },
  { id: 'hub-04', name: 'General' },
];

export const REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES = {
  CLOUD_PROVIDER_NAME: 'cloudProviderName',
  CLOUD_REGION_AND_ONRAMP_NOTES: 'cloudRegionAndOnrampNotes',
  GENERAL_NOTES: 'generalNotes',
  COMPUTE_USE_CASE: 'computeUseCase',
  NETWORK_USE_CASE: 'networkUseCase',
  STORAGE_USE_CASE: 'storageUseCase',
  ICON_ID: 'iconId',
};

export const PROJECT_DETAIL_NOTE_TYPE = 'notes';
export const PROJECT_DETAILS_NOTE_TYPE = {
  COMPLIANCE_NOTE: 'compliance_notes',
  PARTNER_NSP_NOTE: 'partner_nsp_note',
  PARTNER_VAR_NOTE: 'partner_var_note',
  PARTNER_SW_NOTE: 'partner_sw_note',
  PARTNER_MIGRATION_NOTE: 'partner_migration_note',
  PARTNER_HW_NOTE: 'partner_hw_note',
};

export const MODEL_SUB_PANELS = {
  REGION: 'region',
  CUSTOMER: 'customerlocations',
  CLOUDS: 'clouds',
  DATACENTER: 'datacenters',
};
