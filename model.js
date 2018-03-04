
const fs = require("fs");

const DB_FILENAME = "quizzes.json";


//Modelo de datos
let quizzes=[
    {
        question: "Capital de Italia",
        answer: "Roma"
    },
    {
        question:"Capital de Francia",
        answer:"París"
    },
    {
        question:"Capital de España",
        answer:"Madrid"
    },
    {
        question:"Capital de Portugal",
        answer:"Lisboa"
    }
];

const load = () => {

    fs.readFile(DB_FILENAME, (err, data) => {
        if(err){
           if(err.code === "ENOENT"){
               save();
               return;
           }
           throw err;
        }
        let json = JSON.parse(data);
        if (json){
            quizzes = json;
        }
    });

};

const save = () => {
    fs.writeFile(DB_FILENAME, JSON.stringify(quizzes),
        err =>{
            if(err) throw err;
        });
};

//numero de perguntas existentes
exports.count = () => quizzes.length;

//añade un quiz
exports.add = (question, answer) => {
    quizzes.push({
        question: (question || "").trim(),
        answer: (answer || "").trim()
    });
    save();
};

/*
actualiza el quiz
 */
exports.update = (id, question, answer) => {
    const quiz = quizzes[id];
    if(typeof quiz === "undefined"){
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    quizzes.splice(id, 1,{
        question: (question || "").trim(),
        answer: (answer || "").trim()
    });
    save();
};

//devuelve todos los quizzes
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

// devuelve un clon del quiz en una posicion
exports.getByIndex = id => {
    const quiz = quizzes[id];
    if(typeof quiz === "undefined"){
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    return JSON.parse(JSON.stringify(quiz));
};

//borrar un quiz
exports.deleteByIndex = id =>{
    const quiz = quizzes[id];
    if(typeof quiz === "undefined"){
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    quizzes.splice(id, 1);
    save();
};

// cargar quizzes almacenados en el fichero
load();
