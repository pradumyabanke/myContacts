const express = require("express");
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel")

//@desc Get all contacts
//@route Get /api/contacts
//@access public
const getContacts = asyncHandler(async (req, res) => {
    const contacts =    Contact.find();
    res.status(200).json(contacts);
});

//@desc Create all contacts
//@route Post /api/contacts
//@access public
const CreateContact = asyncHandler(async (req, res) => {
    let data = req.body;
    console.log("The request body is :", data);
    const { name, email, phone } = data;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All Fields Are Mandatory..!!")
    }
    const contact = await Contact.create(data);
    res.status(201).json( contact );
});

//@desc GET all contacts
//@route GET /api/contacts
//@access public
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not Found");
    }
    res.status(200).json({ message: `Get Contacts ${req.params.id}` });
});

//@desc Update all contacts
//@route PUT /api/contacts
//@access public
const UpdateContact = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Update Contacts ${req.params.id}` });
});

//@desc Delete all contacts
//@route Delete /api/contacts
//@access public
const deleteContact = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Delete Contacts ${req.params.id}` });

});

module.exports = { getContacts, getContact, CreateContact, UpdateContact, deleteContact } 