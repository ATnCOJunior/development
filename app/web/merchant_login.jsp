<%@page import="Entity.Merchant"%>
<%@page import="DAO.MerchantDAO"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Merchant Login</title>
    </head>
    <body>
        <%
            if (request.getSession() != null && request.getAttribute("username") != null && request.getAttribute("pasword") != null) {
                if (MerchantDAO.retrieve(request.getSession().getAttribute("username").toString(), request.getSession().getAttribute("username").toString()) != null) {
                    Merchant merchant = MerchantDAO.retrieve(request.getSession().getAttribute("username").toString(), request.getSession().getAttribute("username").toString());
                    RequestDispatcher requestDispatcher = request.getRequestDispatcher("index.html");
                    request.setAttribute("merchant", merchant);
                    requestDispatcher.forward(request, response);
                }
            }
        %>

        Login
        <form action="merchant_login" method="get">
            Username: <input type="text" name="username"><br>
            Password: <input type="password" name="password"><br>
            <input type="submit" value="Submit">
        </form>

        Register
        <form action="merchant_register" method="get">
            Username: <input type="text" name="username"><br>
            Password: <input type="password" name="password"><br>
            Company: <input type="text" name="company"><br>
            <input type="submit" value="Submit">
        </form>
    </body>
</html>
