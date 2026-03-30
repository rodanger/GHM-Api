
LAST UPDATE: 18/10/2025



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
                 
   URL: http://127.0.0.1:8000/api/beverages/ 

          {
            "name": "Smirnoff",
            "brand": "Diageo",
            "quantity": 7,
            "unit": "bottles",
            "category": "Vodka"
          }
            
3. Read/GET ex. ------> 

                   
   URL: http://127.0.0.1:8000/api/beverages/
         

4. Update/PUT ------->  

         URL: http://localhost:8000/beverages/1/
                  
              EX:
                  {
                    "name": "Black Label",
                    "brand": "Diageo",
                    "quantity": 12,
                    "unit": "bottles",
                    "category": "Vodka",
                    "min_stock": 8
                  }

5. Delete ---->

        Be measure to select the beverageId to delete this product

        URL: http://localhost:8000/api/beverages/15/ 

              EX: 

                   {
                     "name": "Smirnoff",
                     "brand": "Diageo",
                     "quantity": 7,
                     "unit": "bottles",
                     "category": "Vodka"
                    }
            
