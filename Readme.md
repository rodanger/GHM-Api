

El dia de hoy Febrero 18 a las 11:51 pm
logre conectar mi DB de forma exitosa en postgresql,
usando migracion en django y SQL en PgAdmin4



Characteristics of the REST API

<\/-----------------------------------------\/>

- Inventory System  
- Low Stock Notification
- Waste prevention
- Purchase Optimization 
- Analisys & Report 

<\/-------------------------------------------\/>

End Points///

/api/beverages ---> Beverages Json Data
/api/cleaners   ---> Cleaning Product Data

you can apply CRUD already.


------------------
How to use the API
------------------

1. Authentication is required to use it, get your token first. ---->



2. Create/POST ex. ---->
                 
                  
                   {
                     "name": "Smirnoff",
                     "brand": "Diageo",
                     "quantity": 7,
                     "unit": "bottles",
                     "category": "Vodka"
                   }


              
Read/GET ex. ------> 
                   
                  /api/beverages/


Update/PUT ------->  

                  Just renew the data

Delete ---->

           Be measure to select the beverageId to delete this product

                   {
                     "name": "Smirnoff",
                     "brand": "Diageo",
                     "quantity": 7,
                     "unit": "bottles",
                     "category": "Vodka"
                    }
            
