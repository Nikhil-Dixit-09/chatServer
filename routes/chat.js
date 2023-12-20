const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth')
const chatController=require('../controllers/chat_controller');
router.get('/fetchChat',auth,chatController.fetchChat);
router.post('/accessChat',auth,chatController.accessChat);
router.post('/createGroupChat',auth,chatController.createGroupChat);
router.put('/renameGroupChat',auth,chatController.renameGroupChat);
router.put('/removeGroupChat',auth,chatController.removeFromGroupChat);
router.put('/addGroupChat',auth,chatController.addGroupChat);

router.post('/sendMessage',auth,chatController.sendMessage);
router.get('/getMessages/:chatId',auth,chatController.getMessages);


module.exports=router;