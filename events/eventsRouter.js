const router = require("express").Router();
const eventDB = require("./events-model.js");
const Users = require("../users/users-model");
const mapsDB = require("../maps/maps-model.js");
const { restircted } = require("../auth /authenticate");

router.post("/", restircted, async (req, res) => {
  //1. Check if event has all properties reauired

  //2. Find id of the user paid_by event.paid_by
  // const user = userDB.findBy({event.paid_by}).
  // Check user should exist if
  // event.paid_by = user.id
  //email is a unique thing and a correct measure to identify

  try {
    const event = req.body;
    console.log(
      "Got event ",
      event,
      event.event_name,
      event.date,
      event.total_expenditure,
      event.paid_by,
      event.participants
      // event.participants.length
    );
    if (
      event.event_name &&
      event.date &&
      event.total_expenditure &&
      event.paid_by &&
      event.participants &&
      event.participants.length != 0
    ) {
      // We have got all required field. Now check if paid_by is a valid user in our user table.
      // If not, set error and return.
      //Users.findBy returns array of user objects
      //email is a column name .
      const users = await Users.findBy({ email: event.paid_by });

      if (!users || users.length == 0) {
        console.log("No user for paid by");
        res.status(400).json({ message: "Invalid paid by user ..." });
        return;
      }
      user = users[0];

      //We found valid user, replace its id by email from request.
      console.log("THE PERSON WHO PAID IS:", users);
      event.paid_by = user.id;
      console.log("THE PERSON WHO PAID IS:", user.id);

      //Look up each participants in user table, and make sure they are valid.
      // Produce list of ids//let ids  = []
      //for loop
      let ids = [];
      //event.participants is an array of emails of users participated in a particular event
      const participants = event.participants;
      console.log("Participants ", participants);
      for (let i = 0; i < event.participants.length; i++) {
        let [participant] = await Users.findBy({ email: participants[i] }); // participant is the whole object containing the entire row
        if (!participant) {
          res
            .status(400)
            .json({ message: "No user for participant " + participants[i] });
          console.log("No participant for " + participants[i]);
          return;
        }
        console.log(participant);
        ids.push(participant.id);
      }
      console.log("Done looking up participant...");

      // Now add event in its table
      const newEvent = {
        event_name: event.event_name,
        description: event.description,
        date: event.date,
        total_expenditure: parseFloat(event.total_expenditure),
        paid_by: event.paid_by
      };

      const eid = await eventDB.add(newEvent); //event created after all testings and verification
      console.log("Got id as ", eid);
      if (!eid || eid <= 0) {
        console.log("Failed to insert event...");
        res.status(400).json({ message: "Failed to insert event..." });
        return;
      }

      const n = event.participants.length;
      //Create map table entry for each memeber in ids
      //Map entry - (eid, id, event.total_expenditure/n)
      //Use their id to create map table
      console.log("Total participants = ", n, " Ids = ", ids);

      for (let i = 0; i < ids.length; i++) {
        // loop through all the userids stored in the array who were participants in the event

        const mapEntry = {
          event_id: eid.id,
          user_id: ids[i],
          to_pay: event.total_expenditure / n
        };
        console.log("Adding user ", ids[i], mapEntry);
        await mapsDB.add(mapEntry);
        console.log("Map entry added");
      }

      res.status(200).json({ message: "Event added" });
    } else {
      console.log("Missed mandatory field ....");
      res.status(400).json({
        message:
          "you have missed the mandatory fields to be filled up;event_name,date,total_expenditure,paid_by are essential fields"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "we can't add the new record in event table",
      error: error
    });
  }
});

router.get("/getdues", restircted, async (req, res) => {
  const userId = req.userInfo.subject;
  console.log("Got user id as " + userId);

  //Lookup map table by filter of userId, and get all events for this user
  const eventsPresent = await mapsDB.findBy({ user_id: userId });
  console.log("Events from map table", eventsPresent); //events .present is an array of objects which  has all the events including userid and paymentpart
  // in which a partyicular user was present
  //res.status(200).json({ message: "returning dues", dues: eventsPresent });
  // {eid1, userId, hisPart1}, {eid2, userId, hisPart2},....{eidn, userId, hisPartn}

  let dues = [];
  // //For each of eidi, look up event table to paid_byi for that eventevenevent.
  // for (i = 0; i < eventsPresent.length; i++) {
  //   console.log("Looking up event ", eventsPresent[i].event_id);
  //   const events = await eventDB.findBy({ id: eventsPresent[i].event_id }); //Array
  //   if (events && events.length != 0) {
  //     const event = events[0];

  //     //whole event object
  //     //event.paid_by is the id of user who paid for that event
  //     if (event.paid_by == userId) {
  //       //if this user has paid then skip  this event
  //       continue;
  //     }
  //     console.log("Lookup user ", event);
  //     const payers = await Users.findBy({ id: event.paid_by });
  //     if (payers && payers.length != 0) {
  //       payer = payers[0];
  //       dues.push({
  //         username: payer.username,
  //         email: payer.email,
  //         amountDue: eventsPresent[i].to_pay,
  //         eventName: event.event_name
  //       });
  //     }
  //   }
  // }
  for (i = 0; i < eventsPresent.length; i++) {
    const event = eventsPresent[i];
    if (event.paid_by == userId) {
      continue; //Skip the events, where this user itself is the paid_byi user
    }
    dues.push({
      event_name: event.event_name,
      email: event.email,
      username: event.username,
      amount_to_pay: event.to_pay
    });
  }

  res.status(200).json({ dues: dues });
  //Look up user table to find email id of paid_byi
  //Skip the events, where this user itself is the paid_byi user

  //At this point we have list of  (event idi, paid byi) where this user owes the money

  //Return pairs of (paid_byi, his_parti)

  //Return list of objects containing pair of user email and amont due to that use. Event name as well
  // [
  //   {"alok@abc,com", 10, "Lunch on friday" },
  //   {"arpita@abc,com", 20, "Dinner on Saturday"}
  // ]
});

//2. Get my incoming
router.get("/recievables", restircted, async (req, res) => {
  const userId = req.userInfo.subject;
  // in the maps table  find the user by id and the  all the events he was present
  const eventsPaidByUser = await eventDB.findBy({ paid_by: userId }); //events  paid by this particular user

  //findBy will return array of events object where user paid.
  //eventsPaidByUser.length
  let recievables = []; // {"username" : .., "email" : ..., to_get: ...}
  console.log("Got entries ", eventsPaidByUser.length);
  for (let i = 0; i < eventsPaidByUser.length; i++) {
    const event = eventsPaidByUser[i];
    console.log("here is the eventsPaidByUser events", event);

    if (event.user_id === userId) {
      continue;
    }
    recievables.push({
      event_name: event.event_name,
      date: event.date,
      email: event.email,
      username: event.username,
      to_get: event.to_pay,
      phone: event.phone
    });
  }
  res
    .status(200)
    .json({ message: "hiHere afre your recievables", recievables });
});

function sendSMS(toPhone, message) {
  const accountSid = "ACdc99e303eb69eb0651ded206f69ced7d";
  const authToken = "21f6f60a58b904a921f624a9456e4f21";
  const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      body: message,
      from: "+14085835174",
      to: toPhone
    })
    .then(message => console.log(message.sid));
}
//
// {"phone" : "12345", "username" : "Arpita", "to_pay" : 50}
//
router.post("/sendmessage", restircted, (req, res) => {
  const toPhone = req.body.phone;
  const message = ` Hey,${req.body.username}you, owe me ${to_pay} dollars.!`;

  //sendSMS(toPhone,message);
  console.log("Sending ", message, "to", toPhone);
  res.status(200).json({ message: "check your message" });
});

module.exports = router;
