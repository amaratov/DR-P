const ADMIN_USER = "admin"
const SA_USER = "sa"
const SE_USER = "se"
const CUSTOMER_USER = "cust"
const SALES_USER = "sales"
const MARKETING_USER = "marketing"

module.exports = {
    ADMIN_USER: ADMIN_USER,
    SA_USER: SA_USER,
    SE_USER: SE_USER,
    CUSTOMER_USER: CUSTOMER_USER,
    SALES_USER: SALES_USER,
    MARKETING_USER: MARKETING_USER,
    login: async function(agent, userType){
        let username = ADMIN_USER;
        let password = ADMIN_USER;
        
        if (typeof(userType) === 'undefined'){
            userType = '';
        }

        switch (userType.toLowerCase()){
            case SA_USER:
                username = SA_USER;
                password = SA_USER;
                break;
            case SE_USER:
                username = SE_USER;
                password = SE_USER;
                break;
            case CUSTOMER_USER:
                username = CUSTOMER_USER;
                password = CUSTOMER_USER;
                break;
            case SALES_USER:
                username = SALES_USER;
                password = SALES_USER;
                break;
            case MARKETING_USER:
                username = MARKETING_USER;
                password = MARKETING_USER;
                break;
            default:
                username = ADMIN_USER;
                password = ADMIN_USER;
                break;
        }
        
        username += "@fakeEmail.test";
        
        let res = await agent
                .post('/api/v1/login/')
                .send({username: username, password: password})
        
        return res;
    },
    logout: async function(agent){
        return await agent
            .post('/api/v1/logout');
    }
}