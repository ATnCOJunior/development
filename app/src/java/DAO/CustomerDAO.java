package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import Entity.Customer;

/**
 * This class is responsible to interacts with the database to perform the
 * CRUD(Create,Read,Update & Delete) functions of Customer
 */
public class CustomerDAO {

    private static final String TBLNAME = "Customer";

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
        Logger.getLogger(CustomerDAO.class.getName()).log(Level.SEVERE, msg, ex);
        throw new RuntimeException(msg, ex);
    }

    /**
     * Retrieves all instances of Customer that are stored in the database
     *
     * @return an arrayList of Customers
     */
    public static ArrayList<Customer> retrieveAll() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        ArrayList<Customer> custList = new ArrayList<Customer>();

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
                int age = rs.getInt("age");
                char gender = rs.getString("gender").charAt(0);
                String profession = rs.getString("profession");
                String facebookName = rs.getString("facebook");
                int currentPoints = rs.getInt("current_points");
                //String photo = rs.getString("photo"); needed but Entity class needs to be modified
                //int currentPoints = rs.getInt("current_points"); needed but Entity class needs to be modified

                Customer customer = new Customer(username, password, name, age, gender, profession, facebookName, currentPoints);
                //Customer customer = new Customer(username, password, name, age, gender, profession, facebookName, photo, currentPoints);                
                custList.add(customer);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return custList;
    }

    /**
     * Retrieves an instance of Customer that is stored in the database with provided username and password
     *
     * @param username the Customer username
     * @param password the Customer password
     * @return Customer
     */
    public static Customer retrieve(String username, String password) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        String sql = "";
        Customer customer = null;

        try {
            conn = DBConnector.getConnection();

            sql = "SELECT * FROM " + TBLNAME + " WHERE username='" + username + "' and password='" + password + "'";
            stmt = conn.prepareStatement(sql);

            rs = stmt.executeQuery();
            while (rs.next()) {
                //Retrieve by column name
                String name = rs.getString("name");
                int age = rs.getInt("age");
                char gender = rs.getString("gender").charAt(0);
                String profession = rs.getString("profession");
                String facebookName = rs.getString("facebook");
                int currentPoints = rs.getInt("current_points");
                //String photo = rs.getString("photo"); needed but Entity class needs to be modified
                //int currentPoints = rs.getInt("current_points"); needed but Entity class needs to be modified
                
                customer = new Customer(username, password, name, age, gender, profession, facebookName, currentPoints);
                //customer = new Customer(username, password, name, age, gender, profession, facebookName, photo, currentPoints);
            }
        } catch (SQLException ex) {
            handleSQLException(ex, sql);
        } finally {
            DBConnector.close(conn, stmt, rs);
        }
        return customer;
    }

    /**
     * Creates a specific instance of Customer into the database
     * @param customer the customer that is going to be created
     */
    public static void create(Customer customer) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";
        try {
            conn = DBConnector.getConnection();
            
            sql = "INSERT INTO " + TBLNAME
                    + " (username,password,name,age,gender,profession,facebook) VALUES (?,?,?,?,?,?,?)";
                  //+ " (username,password,name,age,gender,profession,facebook,photo,current_points) VALUES (?,?,?,?,?,?,?,?,?)";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, customer.getUsername());
            stmt.setString(2, customer.getPassword());
            stmt.setString(3, customer.getName());
            stmt.setInt(4, customer.getAge());
            stmt.setString(5, ""+customer.getGender());
            stmt.setString(6, customer.getProfession());
            stmt.setString(7, customer.getFacebookName());
            //stmt.setString(8, customer.getPhoto());
            //stmt.setInt(9, customer.getCurrentPoints());

            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Customer={" + customer + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes a specific customer in the database
     *
     * @param customer the customer to be deleted
     */
    public static void delete(Customer customer) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "DELETE FROM " + TBLNAME
                    + " WHERE username=?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, customer.getUsername());
            
            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Customer={" + customer + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Deletes all customers in the database
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
            handleSQLException(ex, sql, "Customer Table Not Cleared");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }

    /**
     * Allows the user to update the customer in the database (for now it just updates password. Can be used to update other things as well) 
     *
     * @param customer the customer that is going to be updated
     */
    public static void update(Customer customer) {
        Connection conn = null;
        PreparedStatement stmt = null;
        String sql = "";

        try {
            conn = DBConnector.getConnection();
            sql = "UPDATE " + TBLNAME
                    + " SET password=?"
                    + " WHERE username=?";
            stmt = conn.prepareStatement(sql);

            stmt.setString(1, customer.getPassword());
            stmt.setString(2, customer.getUsername());

            stmt.executeUpdate();

        } catch (SQLException ex) {
            handleSQLException(ex, sql, "Customer={" + customer + "}");
        } finally {
            DBConnector.close(conn, stmt);
        }
    }
}
