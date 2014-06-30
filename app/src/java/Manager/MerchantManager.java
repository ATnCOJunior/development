package Manager;

import DAO.MerchantDAO;
import Entity.Merchant;

public class MerchantManager {
    
    public static boolean validate(String username, String password){
        Merchant user = MerchantDAO.retrieve(username, password);
        return user != null;
    }
    
    public static void addUser(Merchant merchant){
       MerchantDAO.create(merchant);
    }
}
