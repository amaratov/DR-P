const DataTypes = require('sequelize').DataTypes; 

const COMPLIANCE_TYPE = 'compliances';
const DATACENTER_TYPE = 'datacenters';
const CLOUD_TYPE = 'clouds';
const ONRAMP_TYPE = 'onramps';
const SERVICES_TYPE = 'services';
const APPLICATION_TYPE = 'applications';
const OFFICE_TYPE = 'offices';

const DEPLOYMENT_TYPE = 'deployment';
const PARTNER_NSP_TYPE = 'partnernsp';
const PARTNER_VAR_TYPE = 'partnervar';
const PARTNER_SW_TYPE = 'partnersw';
const PARTNER_MIGRATION_TYPE = 'partnermig';
const PARTNER_HW_TYPE = 'partnerhw';
const TECHNOLOGY_TYPE = 'technology';

const GENERIC_TYPE = 'generic';
// const PARTNER_TYPE = 'partners';
// const NETWORK_TYPE = 'networks';
// const DATA_TYPE = 'data';
// const CONTROL_TYPE = 'controls';



const TYPES = [
    COMPLIANCE_TYPE, DATACENTER_TYPE, CLOUD_TYPE, 
    ONRAMP_TYPE, SERVICES_TYPE, APPLICATION_TYPE, 
    OFFICE_TYPE, DEPLOYMENT_TYPE, PARTNER_NSP_TYPE,
    PARTNER_VAR_TYPE, PARTNER_SW_TYPE, PARTNER_MIGRATION_TYPE,
    PARTNER_HW_TYPE, TECHNOLOGY_TYPE, GENERIC_TYPE
];

module.exports = function(sequelize){

    let icon = sequelize.define('icon', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        originalFilename: {
            type: DataTypes.STRING,
            allowNull: false,
            default: ''
        },
        iconName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        storageLocation: {
            type: DataTypes.STRING,
        },
        notes: {
            type: DataTypes.STRING,
        },
        industryVertical: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: false,
            defaultValue: []
        },
        useCase: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: false,
            defaultValue: []
        },

        discoveryModel: {
            type: DataTypes.BOOLEAN,
            required: true,
            default: false
        },

        tag: {
            type: DataTypes.ENUM,
            values: TYPES,
            required: false,
            allowNull: true,
            default: null
        },

        partners: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        technologies: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        hub: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        otherTags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },

        createdBy: {
            type: DataTypes.UUID,
            allowNull: false
        },
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        
    });

    icon.COMPLIANCE_TYPE = COMPLIANCE_TYPE;
    icon.OFFICE_TYPE = OFFICE_TYPE;
    icon.DATACENTER_TYPE = DATACENTER_TYPE;
    icon.CLOUD_TYPE = CLOUD_TYPE;
    icon.ONRAMP_TYPE = ONRAMP_TYPE;
    icon.SERVICES_TYPE = SERVICES_TYPE;
    icon.APPLICATION_TYPE = APPLICATION_TYPE;
    // icon.PARTNER_TYPE = PARTNER_TYPE;
    // icon.NETWORK_TYPE = NETWORK_TYPE;
    // icon.DATA_TYPE = DATA_TYPE;
    // icon.CONTROL_TYPE = CONTROL_TYPE;
    icon.GENERIC_TYPE = GENERIC_TYPE;
    icon.DEPLOYMENT_TYPE = 'deployment';
    icon.PARTNER_NSP_TYPE = 'partnernsp';
    icon.PARTNER_VAR_TYPE = 'partnervar';
    icon.PARTNER_SW_TYPE = 'partnersw';
    icon.PARTNER_MIGRATION_TYPE = 'partnermig';
    icon.PARTNER_HW_TYPE = 'partnerhw';
    icon.TECHNOLOGY_TYPE = 'technology';
    icon.TYPES = TYPES;

    return icon;
}