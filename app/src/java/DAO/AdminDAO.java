package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import Entity.Admin;

/**
 * This class is responsible to interacts with the database to perform the
 * CRUD(Create,Read/Retrieve,Update & Delete) functions of Admin
 */
public class AdminDAO {

    private static final String TBLNAME = "Admin";

    /**
     * Provide a consistent manner to handle SQL Exception
     *
     * @param ex The SQLException encountered
     * @param sql The SQL command issued
     * @param parameters Textual representation of the parameters passed in to
     * PreparedStatement
     */
    private static void handleSQLException(SQLException ex, String sql, String... parameters) {
        String msg = "Unable to access data; SQL=" + sql + "\n";
        for (String parameter : parameters) {
            msg += "," + parameter;
        }
        Logger.getLogger(AdminDAO.class.getName()).log(Level.SEVERE, msg, ex);
        throw new RuntimeException(msg, ex);
    }

    /**
     * Retrieves all instances of Admin that are stored in the database
     *
     * @return an arrayList of Admins
     */
    public static ArrayList<Admin> retrieveAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        ArrayList<Admin> adminList = new ArrayList<Admin>();

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME;
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();
            
            while (rs.next()) {
                //Retrieve by column name
                String username = rs.getString("username");
                String password = rs.getString("password");
                String name = rs.getString("name");

                Admin admin = new Admin(username, password, name);
                adminList.add(admin);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return adminList;
    }

    /**
     * Retrieves an instance of Admin that is stored in the database with provided username and password
     *
     * @param username the Admin username
     * @param password the Admin password
     * @return Admin
     */
    public static Admin retrieve(String username, String password) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        Admin admin = null;

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME + " WHERE username='" + username + "' and password='" + password + "'";
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();
            while (rs.next()) {
                //Retrieve by column name
                String name = rs.getString("name");
                
                admin = new Admin(username, password, name);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return admin;
    }

    /**
     * Creates a specific instance of Admin into the database
     * @param admin the admin that is going to be created
     */
    public static void create(Admin admin) {
        ArrayList<Admin> existingAdmin = retrieveAll();
        boolean exists = false;
        for(Admin a : existingAdmin){
            if(a.getUsername().equals(admin.getUsername())){
                exists = true;
            }
        }
        if(exists == false){
            Connection conn = null;
            PreparedStatement stmt = null;
            String sql = "";
            try {
                conn = DBConnector.getConnection();

                sql = "INSERT INTO " + TBLNAME
                        + " (username,password,name) VALUES (?,?,?)";
                stmt = conn.prepareStatement(sql);

                stmt.setString(1, admin.getUsername());
                stmt.setString(2, admin.getPassword());
                stmt.setString(3, admin.getName());

                stmt.executeUpdate();

            } catch (SQLException ex) {
                handleSQLException(ex, sql, "Admin={" + admin + "}");
            } finally {
                DBConnector.close(conn, stmt);
            }
        }
    }

    /**
     * Deletes a specific admin in the database
     *
     * @param admin the admin to be deleted
     */
    public static void delete(Admin admin) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "DELETE FROM " + TBLNAME
                    + " WHERE username=?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, admin.getUsername());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Admin={" + admin + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes all admins in the database
     */
    public static void deleteAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();

            sql = "DELETE FROM " + TBLNAME;
            stmt = conn.prepareStatement(sql);
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Admin Table Not Cleared");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Allows the user to update the admin in the database (for now it just updates password. Can be used to update other things as well) 
     *
     * @param admin the admin that is going to be updated
     */
    public static void update(Admin admin) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "UPDATE " + TBLNAME
                    + " SET password=?"
                    + " WHERE username=?";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, admin.getPassword());
            stmt.setString(2, admin.getUsername());

            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Admin={" + admin + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }
}
