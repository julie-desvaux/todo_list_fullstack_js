const express       = require("express");
const bodyParser    = require("body-parser");
const mongoose      = require("mongoose");
const cors          = require("cors");
const app           = express();
const Schema        = mongoose.Schema;
const router        = express.Router();

app.use(cors());
app.use(bodyParser.json());

// CONNECT SERVER
app.listen(4000, () => {
    console.log("server is up and running on port 4000");
});

// CONNECT DB
const db = "mongodb+srv://julie:test123@cluster0.skpqu.mongodb.net/data?retryWrites=true&w=majority";
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("successfully connected to db"))
    .catch((err) => console.log(err));

// TODO SCHEMA
let todoSchema = new Schema({
    text: String,
    isCompleted: Boolean,
});
let Todo = mongoose.model("Todo", todoSchema);

// ROUTES
app.use("/todos", router);

// READ
router.route("/").get(function (_, res) {
    Todo.find(function (err, items) {
        if (err) {
            res.send(400).send(`ERROR ${err}`);
        } else {
            res.status(200).send(items);
        }
    });
});

// CREATE
router.route("/add").post(function (req, res) {
    let todo = new Todo(req.body);
    todo
        .save()
        .then(() => {
            res.status(200).send({ message: `${todo.text} is successfully added` });
        })
        .catch((err) =>
            res.status(400).send({ error: `error adding document ${err}` })
        );
});

// UPDATE
router.route("/:id").put(function (req, res) {
    Todo.findByIdAndUpdate(req.params.id, req.body)
        .then((todo) => {
            todo.isCompleted = !todo.isCompleted;
            todo.save();
            res.status(200).send({ message: `${todo.text} is successfully updated` });
        })
        .catch((err) =>
            res.status(400).send({ error: `error adding document ${err}` })
        );
});

// DELETE
router.route("/:id").delete(function (req, res) {
    Todo.findByIdAndRemove(req.params.id, function () {
        res.status(200).send({ message: `todo is successfully deleted` });
    }).catch((err) =>
        res.status(400).send({ error: `error adding document ${err}` })
    );
});
