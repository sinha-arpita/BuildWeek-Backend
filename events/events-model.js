const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById
  
};

function find() {
  return db('events')
}


 
      async function findBy(filter) {
        return db
          .select(
      
            "event_name",
            "date",
            "total_expenditure",
            "paid_by",
            "event_id",
            "user_id",
            "to_pay",
            "username",
            "email",
            "phone"
          )
          .from("events")
          .where(filter)
          .innerJoin("maps", "maps.event_id", "=", "events.id")
          .innerJoin("users", "maps.user_id", "=", "users.id");
          
      }
  




async function add(event) {
  const [id] = await db('events').insert(event,["id"]);

  return id;
}

function findById(id) {
  return db('events')
    .where({ id })
    .first();
}

