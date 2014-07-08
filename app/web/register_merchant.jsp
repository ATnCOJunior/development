<%@page import="DAO.MerchantDAO"%>
<%@page import="Entity.Merchant"%>
<%@page import="java.util.ArrayList"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>

        <%
            String username = request.getParameter("new-merchant-id");
            String password = request.getParameter("new-merchant-password");
            String company = request.getParameter("new-merchant-company");
            
            if (MerchantDAO.checkExist(username, password, company)) {
                String message = "Username / Company already exists!";
        %>
            <jsp:forward page="login.html">
                <jsp:param name="error" value="<%=message%>"></jsp:param> 
            </jsp:forward> 
        <%    }else{
                Merchant merchant = new Merchant(username, password, company);
                MerchantDAO.create(merchant);
                session.setAttribute("loggedinMerchant", merchant);
                response.sendRedirect("merchant.html");
            }
            
            %>
    </body>
</html>
