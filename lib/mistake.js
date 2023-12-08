class Definer {
    /**General errors **/
    static general_err1= "att: someting went wrong!";
    static general_err2= "att: there is no data with that params!";
    static general_err3= "att: file upload error!";

    
    
    
    //** Member auth related */

    static auth_err1 = "att: you are inserting already used member nick or phone number";
    static auth_err2 = "There is no such a user with that nickname";
    static auth_err3 = "Your password is not correct";
    static auth_err4 = "att: jwt token creation error";
    static auth_err5 =  "att: You are not authenticated"
    //** Product based errors *//
    static product_err1 ="Product creation is failed!";

    //** Oreders related errors */
    static order_err1 = "att: Order creation is failed"



}

   


module.exports = Definer;