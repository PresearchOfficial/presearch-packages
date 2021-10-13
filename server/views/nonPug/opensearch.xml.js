const opensearchXml = (PRESEARCH_DOMAIN) =>  {

  const domain = `${PRESEARCH_DOMAIN.replace(".org", ".com")}`;

  return `<?xml version="1.0" encoding="utf-8"?>
  <OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
    <ShortName>Presearch</ShortName>
    <Description>Presearch is a decentralized search engine, powered by the community.</Description>
    <InputEncoding>UTF-8</InputEncoding>
    <Image width="32" height="32" type="image/svg+xml">${domain}/images/icon.svg</Image>
    <Url type="text/html" method="get" template="${domain}/search?q={searchTerms}"/>
    <Url type="application/x-suggestions+json" method="get" template="${domain}/api/suggest?q={searchTerms}"/>
  </OpenSearchDescription>`;
}

module.exports = opensearchXml;
