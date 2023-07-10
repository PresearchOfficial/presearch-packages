"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _url = _interopRequireDefault(require("url"));

var _ipfsHttpClient = _interopRequireDefault(require("ipfs-http-client"));

var _Registry = _interopRequireDefault(require("singularitynet-platform-contracts/networks/Registry.json"));

var _Registry2 = _interopRequireDefault(require("singularitynet-platform-contracts/abi/Registry.json"));

var _logger = _interopRequireDefault(require("./utils/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IPFSMetadataProvider {
  constructor(web3, networkId, ipfsEndpoint) {
    this._web3 = web3;
    this._networkId = networkId;
    this._ipfsEndpoint = ipfsEndpoint;
    this._ipfsClient = this._constructIpfsClient();
    const registryAddress = _Registry.default[this._networkId].address;
    this._registryContract = new this._web3.eth.Contract(_Registry2.default, registryAddress);
  }
  /**
   * @param {string} orgId
   * @param {string} serviceId
   * @returns {Promise.<ServiceMetadata>}
   */


  async metadata(orgId, serviceId) {
    _logger.default.debug(`Fetching service metadata [org: ${orgId} | service: ${serviceId}]`);

    const orgIdBytes = this._web3.utils.fromAscii(orgId);

    const serviceIdBytes = this._web3.utils.fromAscii(serviceId);

    const orgMetadata = await this._fetchOrgMetadata(orgIdBytes);
    const serviceMetadata = await this._fetchServiceMetadata(orgIdBytes, serviceIdBytes);
    return Promise.resolve(this._enhanceServiceGroupDetails(serviceMetadata, orgMetadata));
  }

  async _fetchOrgMetadata(orgIdBytes) {
    _logger.default.debug('Fetching org metadata URI from registry contract');

    const {
      orgMetadataURI
    } = await this._registryContract.methods.getOrganizationById(orgIdBytes).call();
    return this._fetchMetadataFromIpfs(orgMetadataURI);
  }

  async _fetchServiceMetadata(orgIdBytes, serviceIdBytes) {
    _logger.default.debug('Fetching service metadata URI from registry contract');

    const {
      metadataURI: serviceMetadataURI
    } = await this._registryContract.methods.getServiceRegistrationById(orgIdBytes, serviceIdBytes).call();
    return this._fetchMetadataFromIpfs(serviceMetadataURI);
  }

  async _fetchMetadataFromIpfs(metadataURI) {
    const ipfsCID = `${this._web3.utils.hexToUtf8(metadataURI).substring(7)}`;

    _logger.default.debug(`Fetching metadata from IPFS[CID: ${ipfsCID}]`);

    const data = await this._ipfsClient.cat(ipfsCID);
    return JSON.parse(data.toString());
  }

  _enhanceServiceGroupDetails(serviceMetadata, orgMetadata) {
    const {
      groups: orgGroups
    } = orgMetadata;
    const {
      groups: serviceGroups
    } = serviceMetadata;
    const groups = (0, _lodash.map)(serviceGroups, group => {
      const {
        group_name: serviceGroupName
      } = group;
      const orgGroup = (0, _lodash.find)(orgGroups, ({
        group_name: orgGroupName
      }) => orgGroupName === serviceGroupName);
      return { ...group,
        payment: orgGroup.payment
      };
    });
    return { ...serviceMetadata,
      groups
    };
  }

  _constructIpfsClient() {
    const {
      protocol = 'http',
      hostname: host,
      port = 5001
    } = _url.default.parse(this._ipfsEndpoint);

    const ipfsHostOrMultiaddr = {
      protocol: protocol.replace(':', ''),
      host,
      port
    };
    return (0, _ipfsHttpClient.default)(ipfsHostOrMultiaddr);
  }

}

exports.default = IPFSMetadataProvider;