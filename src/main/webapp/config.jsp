<%@ page import="fr.ortolang.market.*"%>
<%@ page language="java" contentType="application/javascript; charset=UTF-8" pageEncoding="UTF-8"%>

    var OrtolangConfig = {};
    OrtolangConfig.logoutRedirectUrl='<% out.print(OrtolangMarketConfig.getInstance().getProperty("auth.logout.redirect")); %>';
    OrtolangConfig.serverUrl='<% out.print(OrtolangMarketConfig.getInstance().getProperty("server.url")); %>';
