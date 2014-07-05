<%@page contentType="text/html" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <div id="frame">
            <div style="margin-left: 30px; min-height: 350px">
                <h1>Bootstrap</h1>
                <form method="post" action="uploadFile" enctype="multipart/form-data">
                    <table>
                        <tr>
                            <td style="height:50px;">
                                <span style="font-size: large;">Upload File: </span>
                            </td>
                            <td>
                                <input type="file" name="Open" class="fileupload">
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <input style="width: 90px; height: 35px; font-size: 17px" type="submit" value="Bootstrap">                                 
                            </td>
                        </tr>
                    </table>
                    <%-- note used to document file uploaded --%>
                    <%-- Notes about the file: <input type="text" name="note"><br/> --%>                    
                </form>
                </di>
            </div>
    </body>
</html>
