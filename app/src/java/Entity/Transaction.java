/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package Entity;

/**
 *
 * @author Fujitsu
 */
public class Transaction {
    private String adminUsername;
    private String customerUsername;
    private String company;
    private int dealID;

    public Transaction(String adminUsername, String customerUsername, String company, int dealID) {
        this.adminUsername = adminUsername;
        this.customerUsername = customerUsername;
        this.company = company;
        this.dealID = dealID;
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public void setAdminUsername(String adminUsername) {
        this.adminUsername = adminUsername;
    }

    public String getCustomerUsername() {
        return customerUsername;
    }

    public void setCustomerUsername(String customerUsername) {
        this.customerUsername = customerUsername;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public int getDealID() {
        return dealID;
    }

    public void setDealID(int dealID) {
        this.dealID = dealID;
    }
}
