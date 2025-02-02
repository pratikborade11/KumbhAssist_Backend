import mogoose from "mongoose";

const mongoConnect = async () => {
    try {
        const responce = await mogoose.connect(`${process.env.MONGODB_URL}`);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB CONNECTION ERROR: ", error);
    }
};

export default mongoConnect;
