import app from "./app.js";
import mongoConnect from "./db/index.js";
import "dotenv/config";

mongoConnect().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});
