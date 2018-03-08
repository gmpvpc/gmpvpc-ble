import GloveConnector from "./glove/glove-connector";

let gloveConnector = new GloveConnector("cc78ab7e7c84", (point, movement) => {
    console.log("-------------------------------------");
    console.log(point);
    console.log(movement);
    console.log("-------------------------------------");
});