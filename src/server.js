// This is all about running the server implementing the logging and other server related stuff
import app from "./app.js";


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});