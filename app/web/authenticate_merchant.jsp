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
            String username = request.getParameter("merchant-id");
            String password = request.getParameter("password-2");

            boolean authorize_merchant = false;
            
            //check user is student
            Merchant loggedinMerchant = null;
            Merchant m = null;
            if (MerchantDAO.retrieve(username, password)!= null) {
                    authorize_merchant = true;
                    loggedinMerchant = MerchantDAO.retrieve(username, password);
            }

            if (authorize_merchant) {
                session.setAttribute("loggedinMerchant", loggedinMerchant);
                response.sendRedirect("merchant.html");
                return;
            } else if (!authorize_merchant) {        
        %>
        <jsp:forward page="login.html"></jsp:forward> 
        <%                    }
        %>
    </body>
</html>
