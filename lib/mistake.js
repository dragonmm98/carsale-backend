class Definer {
    /**General errors **/
    static general_err1= "att: someting went wrong!";
    static general_err2= "att: there is no data with that params!";
    static general_err3= "att: file upload error!";

    
    
    
    //** Member auth related */

    static auth_err1 = "att: you are inserting already used member nick or wrong data";
    static auth_err2 = "There is no such a user with that nickname";
    static auth_err3 = "Your password is not correct";
    static auth_err4 = "att: jwt token creation error";
    static auth_err5 =  "att: You are not authenticated"
    //** Product based errors *//
    static product_err1 ="Product creation is failed!";

    //** Oreders related errors */
    static order_err1 = "att: Order creation is failed"
    static order_err2 = "att: Order item creation is failed"
    static order_err3 = "att: No Order with that param excisted"


    // **Article Related Order*/
    static article_err1 = "att: author member for articles not provided"
    static article_err2 = "att: no articles with that member id"
    static article_err3 = "att: no articles data found on this target"

    
    // **Follow Related Order*/
    static follow_err1 = "att: self subscribtion is not allowed"
    static follow_err2 = "att: new follow subscribtion is failed"

}

   


module.exports = Definer;