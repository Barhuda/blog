const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public/'));

mongoose.connect("mongodb+srv://admin:123@cluster0.kyaqu.mongodb.net/todolistDB", { useUnifiedTopology: true, useFindAndModify: false });

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "Welcome to your todo List" });
const item2 = new Item({ name: "Hit the + button to add a new Item" });
const item3 = new Item({ name: "<-- Hit this to delete an item" });

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema)

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}


app.listen(port, function () {

    console.log("Ready");
})



/* var items = [];
var workItems = []; */

app.get("/", function (req, res) {


    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully Added");
                }
                res.redirect("/");
            });
        } else {
            res.render("list", { listTitle: "Today", newItems: foundItems });
        }



    });
})

app.post("/delete", function (req, res) {
    const checkedItemId = mongoose.mongo.ObjectID(req.body.checkbox);
    let listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully deleted")
            }

        })
        res.redirect("/")
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {

            if (err) {
                console.log(err)
            } else {
                console.log("Deleted")
            }


            res.redirect("/" + listName);
        });
    }

})

app.post("/", function (req, res) {
    let newItem = Item({ name: req.body.newItem });
    let listName = req.body.list;

    if (listName === "Today") {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        });

    }


    /*     if (req.body.list != "Work") {
            workItems.push(newItem);
            res.redirect("/work");
        } else {
            newItem.save();
    
            res.redirect("/");
        } */




    console.log('Response Received: ' + newItem);

})

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, function (err, results) {
        if (!results) {
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/" + customListName)
        } else {

            res.render("list", { listTitle: customListName, newItems: results.items });
        }

    })




})





