const express = require('express');
const router = express.Router()
const { all_items,search_item,create_item,edit_item,delete_item,buy_item,itemRequired } = require('../controllers/itemController')
const { isLoggedIn,isAdmin } = require('../passport')



//all items
router.get('/',all_items)


//search by id
router.get('/:id',search_item)


router.use(isLoggedIn)


//buy item
router.put('/buy',buy_item)



router.use(isAdmin)
//create
router.post('/add',itemRequired,create_item)

 //edit
router.put('/edit/:id',edit_item)

//delete
router.delete('/del/:id',delete_item)



module.exports = router