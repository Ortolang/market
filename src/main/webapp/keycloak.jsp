<%@ page import="fr.ortolang.market.*"%>

{
  "realm": "<% out.print(OrtolangMarketConfig.getInstance().getProperty("auth.realm.name")); %>",
  "realm-public-key": "<% out.print(OrtolangMarketConfig.getInstance().getProperty("auth.server.pubkey")); %>",
  "auth-server-url": "<% out.print(OrtolangMarketConfig.getInstance().getProperty("auth.server.url")); %>",
  "ssl-required": "external",
  "resource": "<% out.print(OrtolangMarketConfig.getInstance().getProperty("auth.server.resourcename")); %>",
  "public-client": true
}
