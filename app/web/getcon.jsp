<%@ page import="java.sql.*" %>
<%!Statement st = null;
    Connection cn = null;
%>
<%
    Class.forName("sun.jdbc.odbc.JdbcOdbcDriver");
    cn = DriverManager.getConnection("jdbc:odbc:data", "root", "");
    <!-- database name = data, username = root, password = blank--
            > st = cn.createStatement();
%>
