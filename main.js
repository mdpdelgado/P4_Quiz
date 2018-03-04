
const readline = require('readline');

console.log("CORE Quiz");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'quiz> ',
  completer: (line) => {
  const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // show all completions if none found
  return [hits.length ? hits : completions, line];
	}
});

rl.prompt();

rl
.on('line', (line) => {

	let args = line.split(" ");
	let cmd = args[0].toLowerCase().trim();

	switch (cmd) {
  		case '':
  			rl.prompt();
  			break;
   
    	case 'help':
    	case 'h':
    		helpCmd();	
    		break;

    	case 'quit':
    	case 'q':
    		quitCmd();
    		break;

    	case 'add':
    		addCmd();
    		break;

    	case 'list':
    		listCmd();
    		break;

    	case 'show':
    		showCmd(args[1]);
    		break;

    	case 'test':
    		testCmd(args[1]);
    		break;

    	case 'play':
    	case 'p':
    		playCmd();
    		break;

    	case 'delete':
    		deleteCmd(args[1]);
    		break;

   		case 'edit':
   			editCmd(args[1]);
   			break;

   		case 'credits':
   			creditsCmd();
  			break;

    	default:
      		console.log(`Comando desconocido: '${cmd}'`);
      		console.log("Use help para ver todos los comandos disponibles");
      		rl.prompt();
      		break;
 	 }
 
})

.on('close', () => {
  console.log('Adios!');
  process.exit(0);
});


const helpCmd = () =>{
	console.log("Comandos:");
  console.log("  h|help - Muestra esta ayuda");
 	console.log("  list - Listar los quizzes existentes");
 	console.log("  show<id> - Muestra la pregunta y la respuesta del quiz indicado");
  console.log("  add - Añadir un nuevo quiz interactivamente");
  console.log("  delete <id> - borra el quiz indicado");
 	console.log("  edit <id> - editar el quiz indicado");
 	console.log("  test <id> - probar el quiz indicado");
 	console.log("  p|play - jugar a preguntar aleatoriamente todos los quizzes");
 	console.log("  credits - créditos");
  console.log("  q|quit - salir del programa");
  rl.prompt();
};

const quitCmd = () => {
	rl.close();
};

const addCmd = () => {
	console.log("añadir un nuevo quiz");
	rl.prompt();
};

const listCmd = () => {
	console.log('listar todos los quizzes existentes');
	rl.prompt();
};

const showCmd = id => {
	console.log('mostrar el quiz indicado');
	rl.prompt();
};

const testCmd = id => {
	console.log('probar el quiz indicado');
	rl.prompt();
};

const playCmd = () => {
	console.log("Jugar");
	rl.prompt();
};

const deleteCmd = id => {
	console.log('borrar el quiz indicado');
	rl.prompt();
};

const editCmd = id => {
	console.log('editar el quiz indicado');
	rl.prompt();
};

const creditsCmd = () => {
	console.log('Autores de la práctica');
  	console.log('María del Pilar Delgado Pardo');
  	rl.prompt();
};