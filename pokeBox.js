//npm install typescript
//npm install @types/node
//npm install base64-js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require('express');
var app = express();
var box = [];
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(3000, function () { return console.log('Listening on port 3000.'); });
app.get('/', function (req, res) {
    res.send("\n    <h1>Pok\u00E9mon API</h1>\n    <ul>\n      <li><a href=\"/store\">Store</a></li>\n      <li><a href=\"/box\">Box</a></li>\n      <li><a href=\"/viewPokemon\">View Pok\u00E9mon</a></li>\n    </ul>\n  ");
});
//html output to input pokemon choice
app.get('/store', function (req, res) {
    res.send("\n    <h1>Store Pok\u00E9mon</h1>\n    <form method=\"get\" action=\"/store/pokemon\">\n      <input type=\"text\" name=\"pokemonName\" placeholder=\"Enter Pok\u00E9mon name\">\n      <button type=\"submit\">Store</button>\n    </form>\n  ");
});
//limit requirement 
app.get('/store/pokemon', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var pokemonName, response, pokemonData, pokemonImageResponse, imageData, imageBase64, soundResponse, soundData, soundBase64, pokemon, i, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (box.length >= 1000) {
                    res.status(400).send('Error: Box is full. Cannot store more Pokémon.');
                    return [2 /*return*/];
                }
                pokemonName = req.query.pokemonName;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                return [4 /*yield*/, fetch("https://pokeapi.co/api/v2/pokemon/".concat(pokemonName))];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                pokemonData = _a.sent();
                return [4 /*yield*/, fetch(pokemonData.sprites.front_default)];
            case 4:
                pokemonImageResponse = _a.sent();
                return [4 /*yield*/, pokemonImageResponse.arrayBuffer()];
            case 5:
                imageData = _a.sent();
                imageBase64 = Buffer.from(imageData).toString('base64');
                return [4 /*yield*/, fetch(pokemonData.cries.latest)];
            case 6:
                soundResponse = _a.sent();
                return [4 /*yield*/, soundResponse.arrayBuffer()];
            case 7:
                soundData = _a.sent();
                soundBase64 = Buffer.from(soundData).toString('base64');
                pokemon = {
                    id: pokemonData.id,
                    name: pokemonData.name,
                    image: imageBase64,
                    moves: [],
                    sound: "data:audio/wav;base64,".concat(soundBase64),
                };
                for (i = 0; i < pokemonData.moves.length; i++) {
                    pokemon.moves.push(pokemonData.moves[i].move.name);
                }
                //lalagay sa box 
                box.push(pokemon);
                res.json(pokemon);
                return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                res.status(400).send("Error storing pokemon: ".concat(error_1.message));
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
app.get('/box', function (req, res) {
    res.json(box);
});
app.get('/viewPokemon', function (req, res) {
    res.send("\n    <h1>View Pok\u00E9mon</h1>\n    <form method=\"get\" action=\"/viewPokemon/result\">\n      <input type=\"text\" name=\"pokemonName\" placeholder=\"Enter Pok\u00E9mon name\">\n      <button type=\"submit\">View</button>\n    </form>\n  ");
});
app.get('/viewPokemon/result', function (req, res) {
    var pokemonName = req.query.pokemonName;
    var foundPokemon = box.find(function (pkmn) { return pkmn.name === pokemonName; }); //type bool
    console.log(foundPokemon);
    if (!foundPokemon) {
        res.status(400).send("Error: Pok\u00E9mon not found in box");
    }
    else { // Html output to show pokemon 
        res.send(" \n      <h1>View Pok\u00E9mon</h1>\n      <p>Name: ".concat(foundPokemon.name, "</p>\n      <p>Image: <img src=\"data:image/png;base64,").concat(foundPokemon.image, "\" /></p>\n      <p>Base64 Image: ").concat(foundPokemon.image, "</p>\n      <p>Moves: ").concat(foundPokemon.moves.join(', '), "</p>\n      <p>Sound: ").concat(foundPokemon.name, ".wav</p>\n      <p><audio controls>\n        <source src=\"").concat(foundPokemon.sound, "\" type=\"audio/wav\">\n        Your browser does not support the audio element.\n      </audio></p>\n    "));
    }
});
