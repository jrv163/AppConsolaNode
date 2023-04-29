require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { 
  inquireMenu, 
  pausa, 
  leerInput, 
  listadoTareaBorrar,
  confirmar,
  mostrarListadoCheckList

} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');
//const { mostrarMenu, pausa } = require('./helpers/mensajes');


const main = async() => {

  let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if ( tareasDB ){
      // establecer las tareas
      // TODO: cargar tareas
      tareas.cargarTareasFromArray( tareasDB );
    }

    do {
      //  Imprimir menú
      opt = await inquireMenu();
      
      switch (opt) {
        case '1':
          // crear opcion
          const desc = await leerInput('Descripción:');
          tareas.crearTarea( desc )
          break;

        case '2':
          console.log(tareas.listadoCompleto())
         //console.log( tareas.listadoArr )
          break;

        case '3': // listar completadas
          console.log(tareas.listarPendiantesCompletadas(true))
      
          break;
        case '4': // listar pendientes
          console.log(tareas.listarPendiantesCompletadas(false))
      
          break;
        case '5': // completado | pendiente
          const ids = await mostrarListadoCheckList( tareas.listadoArr )
          tareas.toggleCompletadas( ids );
      
          break;

        case '6': // borrar tarea
          const id = await listadoTareaBorrar( tareas.listadoArr );
          if ( id !== '0' ) {

            const ok = await confirmar('Estas Seguro?');
            if ( ok ) {
               tareas.borrarTarea( id );
               console.log( 'Tarea borraeda' )
            }
          }
      
          break;
      }

      guardarDB( tareas.listadoArr );

      await pausa();
      
      //if ( opt !== '0' ) await pausa();
    } while ( opt !== '0' );


   // pausa();

}
main();
