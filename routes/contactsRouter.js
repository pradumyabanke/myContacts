const express = require("express");
const router = express.Router();
const { getContact,
    getContacts,
    CreateContact,
    UpdateContact,
    deleteContact } = require("../controllers/contactsControllers");


router.route("/").get(getContacts).post(CreateContact);
router.route("/:id").get(getContact).put(UpdateContact).delete(deleteContact);


module.exports = router;