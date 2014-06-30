<%@page import="Manager.MerchantManager"%>
<%
    if (!MerchantManager.validate(session.getAttribute("username").toString(), session.getAttribute("password").toString())) {
        response.sendRedirect("merchant_login.jsp");
        return;
    }
%>