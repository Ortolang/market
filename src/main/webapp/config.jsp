<%@ page import="fr.ortolang.market.*"%>
<%@ page language="java" contentType="application/javascript; charset=UTF-8" pageEncoding="UTF-8"%>

    var OrtolangConfig = {};
    OrtolangConfig.logoutRedirectUrl='<% out.print(OrtolangMarketConfig.getInstance().getProperty("auth.logout.redirect")); %>';
    OrtolangConfig.apiServerUrlDefault='<% out.print(OrtolangMarketConfig.getInstance().getProperty("api.server.url.default")); %>';
    OrtolangConfig.apiServerUrlNoSSL='<% out.print(OrtolangMarketConfig.getInstance().getProperty("api.server.url.nossl")); %>';
    OrtolangConfig.apiContentPath='<% out.print(OrtolangMarketConfig.getInstance().getProperty("api.sub.path")); %>';
    OrtolangConfig.apiSubPath='<% out.print(OrtolangMarketConfig.getInstance().getProperty("api.sub.path")); %>';
