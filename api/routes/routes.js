const AccountController = require('../controllers/accountController');
const ChatroomController = require('../controllers/chatroomController');
const ChatMessageController = require('../controllers/chatmessageController');
const DiaryController = require('../controllers/diaryController');
const QuoteController = require('../controllers/quoteController');
const TargetController = require('../controllers/targetController');
const SubstanceController = require('../controllers/substanceController');

var express = require('express');

var app = express.Router();
var cors = require('cors');
var corsOptions = {
    origin: true
}

app.get('/accounts', cors(corsOptions), AccountController.getAccounts);

app.post('/account', cors(corsOptions), AccountController.signup);
app.post('/account/login', cors(corsOptions), AccountController.signin);

app.get('/account/:accountId', cors(corsOptions), AccountController.getAccount);
app.delete('/account/:accountId', cors(corsOptions), AccountController.deleteAccount);

app.put('/account/username/:accountId', cors(corsOptions), AccountController.setUsername);
app.put('/account/password/:accountId', cors(corsOptions), AccountController.updatePassword);
app.put('/account/email/:accountId', cors(corsOptions), AccountController.setEmail);
app.put('/account/supervisor/:accountId', cors(corsOptions), AccountController.setSupervisor);
app.put('/account/name/:accountId', cors(corsOptions), AccountController.setName);
app.put('/account/gender/:accountId', cors(corsOptions), AccountController.setGender);
app.put('/account/telephone/:accountId', cors(corsOptions), AccountController.setTelephone);
app.put('/account/birthday/:accountId', cors(corsOptions), AccountController.setBirthday);
app.put('/account/address/:accountId', cors(corsOptions), AccountController.setAddress);
app.put('/account/graduation/:accountId', cors(corsOptions), AccountController.addGraduation);
app.put('/account/emergencycontact/:accountId', cors(corsOptions), AccountController.setEmergencyContact);

app.put('/account/supervisoraccess/:accountId', cors(corsOptions), AccountController.setSupervisorAccess);

app.post('/account/verify/:accountId', cors(corsOptions), AccountController.verify);

app.get('/supervisor/:supervisorId', cors(corsOptions), AccountController.getClients);

app.get('/accounts/unassigned', cors(corsOptions), AccountController.getUnassigned);

app.post('/account/target/:accountId', cors(corsOptions), TargetController.addTarget);

app.get('/account/target/:accountId', cors(corsOptions), TargetController.getTarget);

app.post('/account/target/:accountId/:substance', cors(corsOptions), TargetController.getIntervalTargets);
app.put('/account/target/:accountId/:targetId', cors(corsOptions), TargetController.updateTarget);
app.delete('/account/target/:accountId/:targetId', cors(corsOptions), TargetController.deleteTarget);

app.route('/substance')
    .post(cors(corsOptions),SubstanceController.createSubstance);

app.route('/substance/:substanceId')
    .post(cors(corsOptions),SubstanceController.getSubstanceById)
    .put(cors(corsOptions),SubstanceController.updateSubstance)
    .delete(cors(corsOptions),SubstanceController.deleteSubstance);

app.route('/substances/:accountId')
    .get(cors(corsOptions),SubstanceController.getSubstances);


app.route('/account/roles/:type')
    .get(cors(corsOptions), AccountController.getRoles);

app.route('/account/role/:accountId')
    .get(cors(corsOptions), AccountController.getRole)
    .put(cors(corsOptions), AccountController.setRole);

app.route('/chatroom/:userID')
    .get(cors(corsOptions), ChatroomController.getChatrooms);

app.route('/chatroom')
    .post(cors(corsOptions), ChatroomController.createChatroom)
    .get(cors(corsOptions), ChatroomController.getAllChatrooms);

app.route('/chatroom/unread/:accountId')
    .get(cors(corsOptions), ChatroomController.hasUnreadMessages)
    .post(cors(corsOptions), ChatroomController.channelHasUnreadMessages);

app.route('/chatroom/category/:chatroomID')
    .put(cors(corsOptions), ChatroomController.setCategory);

app.route('/chatroom/:chatroomID')
    .post(cors(corsOptions), ChatroomController.addParticipant)
    .put(cors(corsOptions), ChatroomController.replaceParticipants);

app.route('/chatmessage')
    .post(cors(corsOptions), ChatMessageController.createChatMessage);

app.route('/chatmessage/:chatroomID')
    .get(cors(corsOptions), ChatMessageController.getAllChatroomMessages)
    .put(cors(corsOptions), ChatMessageController.readAllMessages);

app.route('/diaryentry')
    .post(cors(corsOptions), DiaryController.createDiaryEntry);

app.route('/diaryentry/:diaryID')
    .get(cors(corsOptions), DiaryController.getDiaryEntry)
    .put(cors(corsOptions), DiaryController.updateDiaryEntry)
    .delete(cors(corsOptions), DiaryController.deleteDiaryEntry);

app.post('/diary/:userID/:substance', DiaryController.getIntervalEntries);

app.route('/diary/:userID')
    .get(cors(corsOptions), DiaryController.getDiaryEntries)
    .delete(cors(corsOptions), DiaryController.deleteDiaryEntries);

app.route('/quotes')
    .get(cors(corsOptions), QuoteController.getQuotes);

app.route('/quote')
    .get(cors(corsOptions), QuoteController.getQuoteOfTheDay)
    .post(cors(corsOptions), QuoteController.addQuote);

app.route('/quote/:quoteId')
    .get(cors(corsOptions), QuoteController.getQuote)
    .delete(cors(corsOptions), QuoteController.deleteQuote)
    .put(cors(corsOptions), QuoteController.updateQuote)

app.route('/auth/forgot_password')
    .post(AccountController.forgot_password);

app.route('/auth/reset_password')
    .post(cors(corsOptions),AccountController.reset_password);

module.exports = app;