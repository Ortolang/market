<%@ page import="fr.ortolang.market.*"%>
<%@ page language="java" contentType="application/javascript; charset=UTF-8" pageEncoding="UTF-8"%>

var logoutRedirectUrl='<% out.print(OrtolangMarketConfig.getInstance().getProperty("auth.logout.redirect")); %>';
var baseUrl='<% out.print(OrtolangMarketConfig.getInstance().getProperty("server.url")); %>';
