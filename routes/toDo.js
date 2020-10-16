const express = require("express");
const bodyParser = require("body-parser");
require('../config/Utility');

const {Connection} = require ("../config/connectDB");
const {Item, itemSchema} = require ("../schemas/items");
const { request, response } = require("express");
const Utility = require("../config/Utility");

const router = express.Router();

router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json);



const Conectar = new Connection('todolist', itemSchema);
Conectar.Connect()
  .then((ItemModel) => {

        router.get("/", (request, response) => {

    let result = {
      version: 0,
      tasks: []
  };
 
  let filterQuery = {};

  if ('filterByState' in request.query) {
      filterQuery.State = request.query.filterByState;
  }

  if ('dateGreaterThan' in request.query || 'dateLessThan' in request.query) {
      filterQuery.dueDate = {};

      if ('dateGreaterThan' in request.query) {
          filterQuery.dueDate.$gt = request.query.dateGreaterThan
      }
  
      if ('dateLessThan' in request.query) {
          filterQuery.dueDate.$lt = request.query.dateLessThan
      }
  }

  result.version = Utility.getDatabaseVersion().then(function(id) {
      result.version = id;

       
      if (!Utility.validateDatabaseHasBeenModified(id, request)) {
          response.sendStatus(304);
          return;
      }
      
 
      ItemModel.find(filterQuery, function(err, tasks) {
          if (err) {
              console.log(err);
              response.sendStatus(500);
          } else {
              result.tasks = tasks;
              response.setHeader('etag', id);
              response.send(result);
          }
      });
  });
        });

        router.post("/", (req, res)=>{
          let item = "";
          let itemInsert = '';
          let data = req.body;

          Utility.getDatabaseVersion().then(function(id) {
             
            if (Utility.validateDatabaseHasBeenModified(id, req)) {
              res.sendStatus(409);
              return;
            }

            item = new Item(0, data.Description, data.State, data.dueDate, 1);
        
            item._id = Utility.assignTaskID().then(function(id) {
              item._id = id;
          
              itemInsert = new ItemModel(item);
              Utility.updateDatabaseVersion();
              Utility.increaseTaskCounter();
          
              itemInsert.save((err) => {
                if (err) res.status(500).json(err)
                else res.status(200).json(item);
              });
            });
        });
      });

        router.put("/:id", (req, res) => {
          let data = req.body;
          Utility.getDatabaseVersion().then(function(id) {
                     
              if (Utility.validateDatabaseHasBeenModified(id, req)) {
                  res.sendStatus(409);
                  return;
              }
      
              let update = data;
              
              update.Version = Utility.getTaskVersion(req.params.id, ItemModel).then(function(version) {
                  update.Version = ++version;
        
                  ItemModel.updateOne({_id: req.params.id}, update, (err) => {
                      if (err) res.status(500).json(err)
                      else {
                        Utility.updateDatabaseVersion();
                        res.status(200).send('OK');
                      }
                  });  
              });     
          })
        });

        router.delete("/:id", (req, res) => {
          Utility.getDatabaseVersion().then(function(id) {
             
            if (Utility.validateDatabaseHasBeenModified(id, req)) {
                res.sendStatus(409);
                return;
            }
    
            ItemModel.deleteOne({_id: req.params.id}, (err) => {
              if (err) res.status(500).json(err)
              else {
                Utility.updateDatabaseVersion();
                res.status(200).send("OK");
              } 
    
            });
        })
        });

        router.patch("/:id", (req, res) => {
        let data = req.body;

        Utility.getDatabaseVersion().then(function(id) {
           
            if (Utility.validateDatabaseHasBeenModified(id, req)) {
                res.sendStatus(409);
                return;
            }
    
            let updatedProperty = {};
            let numberOfPropertiesToBeUpdated = 0;
            
            for (const key in data) {
                if (data[key] !== undefined) {
                    numberOfPropertiesToBeUpdated++;
                    updatedProperty[key] = data[key];
                }
            }
        

            if (numberOfPropertiesToBeUpdated > 1) { 
                res.sendStatus(400);
                return;
            }
    
            updatedProperty.Version = Utility.getTaskVersion(req.params.id, ItemModel).then(function(version) {
                updatedProperty.Version = ++version;
      
                ItemModel.updateOne({_id: req.params.id}, updatedProperty, (err) => {
                    if (err) res.status(500).json(err)
                    else
                    {
                        Utility.updateDatabaseVersion();
                        res.status(200).send('OK');
                    }
                });  
            }); 
        });

        });
    })

  .catch((err) => console.log(err));

module.exports = router;
