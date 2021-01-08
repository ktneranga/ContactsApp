//contacts are going to have CRUD function of contacts
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Contact = require('../models/Contacts');

//@route        GET api/contacts
//@desc         get all users contact
//@access       private

router.get('/', auth, async(req, res)=>{
    // res.send('Get all contacts');
    try {
        const contacts = await Contact.find({user : req.user.id}).sort({date : -1});
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route        POST api/contacts
//@desc          add a new contact
//@access       private

router.post('/', [auth, [
    check('name', 'name is required').not().isEmpty(),
]],async (req, res)=>{
    // res.send('Add a new contact');
    const errors = validationResult(req);
    //check if there are any errors
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    //if there are no errors
    const {name, email, phone, type} = req.body;

    try {
        //create a new contact
        const newContact = new Contact({
            name : name,
            email : email,
            phone : phone,
            type : type,
            user : req.user.id
        });

        //save the contact into the database
        const contact = await newContact.save();
        res.json(contact);

    } catch (err) {
        console.error(err.message).send('Server error!');
    }

});

//@route        PUT api/contacts/:id
//@desc          update a contacts
//@access       private

router.put('/:id', auth, async (req, res)=>{
    // res.send('Update a contact');
    const {name, email, phone, type} = req.body;
    //build contact object based on the data submited / since this is an update
    const contactFields = {};
    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    try {
        //find the relevant contact with the id passed through the url (req.params.id)
        let contact = await Contact.findById(req.params.id);
        if(!contact) return res.status(404).json({msg : 'Contact not found'});

        //make sure that the contact owns by the user
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({msg : 'Unauthorized'});
        }

        contact = await Contact.findByIdAndUpdate(req.params.id, 
            {$set : contactFields},
            {new : true});

            res.json(contact);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route        DELETE api/conatcts/:id
//@desc         delete a contact
//@access       private

router.delete('/:id',auth, async(req, res)=>{
    // res.send('Delete a contact');
    try {
        //find the relevant contact with the id passed through the url (req.params.id)
        let contact = await Contact.findById(req.params.id);
        if(!contact) return res.status(404).json({msg : 'Contact not found'});

        //make sure that the contact owns by the user
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({msg : 'Unauthorized'});
        }

        //if all correct delete the contact
        await Contact.findByIdAndRemove(req.params.id);

        res.json({msg : 'Contact removed'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;