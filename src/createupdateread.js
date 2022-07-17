const mongoose = require("mongoose");
const User = require("./user");

class Createupdatereaduser {
    constructor() {}

    async createOrUpdateUser(name,points) {
        try {
            await mongoose.connect(process.env.MONGO_URI).then(async () => {
                let found = null;
                await User.findOne({name:name}).then(async d=> {
                    // update
                    if(d != null) {
                        points += d.points;
                        await User.updateOne({name,points});
                        console.log("updating user");
                        console.log(d);
                        found = 1;
                    }
                });
                if(found == null) {
                    //conso
                    console.log("creating user");
                    await User.create({name,points});
                    return;
                }
                return;
            }).catch(e=>new Error(e));
        }catch(err) {
            throw new Error(err);
        }
    }

    async getUsers() {
        let result = [];
        try {
            await mongoose.connect(process.env.MONGO_URI).then(async () => {
               
                await User.find({}).then(d=> {
                    result = d;
                });
            }).catch(e=>new Error(e));
        }catch(err) {
            throw new Error(err);
        }
        return result;
    }
}

module.exports = Createupdatereaduser;