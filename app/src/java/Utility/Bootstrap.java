package utility;

import DAO.CustomerDAO;
import DAO.DealDAO;
import DAO.MerchantDAO;
import Entity.Customer;
import Entity.Deal;
import Entity.Merchant;
import au.com.bytecode.opencsv.CSVReader;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.tomcat.util.http.fileupload.*;
import org.apache.tomcat.util.http.fileupload.ServletFileUpload;

import flexjson.JSONSerializer;
import java.text.DateFormat;
import java.util.Iterator;
import javax.servlet.RequestDispatcher;
import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.json.simple.*;

public class Bootstrap extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        try {
            //From org.apache.commons.fileupload.servlet.ServletFileUpload
            //This file handles multiple files per single HTML widget, sent using multipart/mixed encoding type
            //upload.getItemIterator(request) parses in the servlet request from view to return an iterator of instances of FileItemStream parsed from the request, in the order that they were transmitted.
            ServletFileUpload upload = new ServletFileUpload();
            FileItemIterator itemIterator = upload.getItemIterator(request);
            while (itemIterator.hasNext()) {
                FileItemStream item = itemIterator.next();
                bootstrap(item, out, request, response);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            out.close();
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    public void bootstrap(FileItemStream item, PrintWriter out, HttpServletRequest request, HttpServletResponse response) throws IOException {

        JSONSerializer serializer = new JSONSerializer().prettyPrint(true);

        //item.isFormField means item is empty
        if (!item.isFormField()) {
            //Setting the necessary BufferedReader for CSVReader
            InputStream is = item.openStream();
            BufferedInputStream bis = new BufferedInputStream(is);
            ZipInputStream zis = new ZipInputStream(bis);
            InputStreamReader isr = new InputStreamReader(zis);
            BufferedReader br = new BufferedReader(isr);

            //Instantiating of ArrayLists to be populated
            ArrayList<String[]> customerList = new ArrayList<String[]>();
            ArrayList<String[]> merchantList = new ArrayList<String[]>();
            ArrayList<String[]> dealList = new ArrayList<String[]>();
            ArrayList<String[]> dealCategoryList = new ArrayList<String[]>();
            ArrayList<String[]> dealSharedList = new ArrayList<String[]>();
            ArrayList<String[]> redemptionList = new ArrayList<String[]>();
            ArrayList<String[]> transactionList = new ArrayList<String[]>();

            //while-loop to retrieve String[] from csv files into arrayList<String[]>s. 
            ZipEntry ze;

            while ((ze = zis.getNextEntry()) != null) {
                CSVReader csvReader = new CSVReader(br, ',', '"', 1);
                if (ze.toString().equalsIgnoreCase("customer.csv")) {
                    customerList = readCSV(ze, csvReader);
                }

                if (ze.toString().equalsIgnoreCase("merchant.csv")) {
                    merchantList = readCSV(ze, csvReader);
                }

                if (ze.toString().equalsIgnoreCase("deal.csv")) {
                    dealList = readCSV(ze, csvReader);
                }

                if (ze.toString().equalsIgnoreCase("dealCategory.csv")) {
                    dealCategoryList = readCSV(ze, csvReader);
                }

                if (ze.toString().equalsIgnoreCase("dealShared.csv")) {
                    dealSharedList = readCSV(ze, csvReader);
                }

                if (ze.toString().equalsIgnoreCase("redemption.csv")) {
                    redemptionList = readCSV(ze, csvReader);
                }

                if (ze.toString().equalsIgnoreCase("transaction.csv")) {
                    transactionList = readCSV(ze, csvReader);
                }
            }
            //Clear all the tables 
            clearTables();

            //Validating and processing the populating of data within ArrayLists into database via DAOs
            processPopulateCustomer(customerList);

            processPopulateMerchant(merchantList);

            processPopulateDeal(dealList);

            processPopulateDealCategory(dealCategoryList);

            processPopulateDealShared(dealSharedList);

            processPopulateRedemption(redemptionList);

            processPopulateTransaction(redemptionList);
        }
    }

    private ArrayList<String[]> readCSV(ZipEntry ze, CSVReader csvReader) throws IOException {
        ArrayList<String[]> list = new ArrayList<String[]>();
        String columns[];
        while ((columns = csvReader.readNext()) != null) {
            String[] array = columns;
            list.add(array);
        }

        return list;
    }

    private void clearTables() {
        //Clears table in reverse order using DAO.deleteAll() methods
        CustomerDAO.deleteAll();
        MerchantDAO.deleteAll();
        DealDAO.deleteAll();
    }

    private void processPopulateCustomer(ArrayList<String[]> customerList) {
        for (String[] columns : customerList) {
            int age = Integer.parseInt(columns[3]);
            char gender = columns[4].charAt(0);
            int currentPoints = Integer.parseInt(columns[7]);
            Customer customer = new Customer(columns[0], columns[1], columns[2], age, gender, columns[5], columns[6], currentPoints);
            CustomerDAO.create(customer);
        }
    }

    private void processPopulateMerchant(ArrayList<String[]> merchantList) {
        for (String[] columns : merchantList) {
            Merchant merchant = new Merchant(columns[0], columns[1], columns[2]);
            MerchantDAO.create(merchant);
        }
    }

    private void processPopulateDeal(ArrayList<String[]> dealList) throws ParseException {
        DateFormat formatter = null;
        formatter = new SimpleDateFormat("dd-MMM-yyyy");
        for (String[] columns : dealList) {
            int dealID = Integer.parseInt(columns[1]);
            Date date_initiated = (Date) formatter.parse(columns[2]);
            Date date_expired = (Date) formatter.parse(columns[3]);
            int shares_required = Integer.parseInt(columns[4]);
            int shares_current = Integer.parseInt(columns[5]);
            int views = Integer.parseInt(columns[7]);
            Deal deal = new Deal(columns[0], dealID, date_initiated, date_expired, shares_required, shares_current, columns[6], views);
            DealDAO.create(deal);
        }
    }

    private void processPopulateDealCategory(ArrayList<String[]> dealCategoryList) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    private void processPopulateDealShared(ArrayList<String[]> dealSharedList) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    private void processPopulateRedemption(ArrayList<String[]> redemptionList) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    private void processPopulateTransaction(ArrayList<String[]> redemptionList) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
    
}