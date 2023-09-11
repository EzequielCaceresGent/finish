/**
	Convenciones de escritura:
        Para la creacion de tablas:
        	* Los nombres de las tablas son PascalCase y singular: `Persona`
        	* Los nombres de los campos son camelCase: `nombreDeUsuario`
        	* Las claves primarias usan el prefijo PK: `PK_idLibro`
        	* Las claves foraneas usan el prefijo FK: `FK_autor`
			* Las tablas intermedias que representan una relacion de muchos a muchos deben tener los nombres de las tablas que participan en la relacion separados por una barra: `Libro/Editorial`
		Los nombres de las CONSTRAINTs deben tener un prefijo que especifique el tipo de CONSTRAINT seguido del nombre de la tabla al que aplican
			* PKC = Primary Key Constraint
				Solo utilizar una CONSTRAINT explicita cuando se necesiten llaves compuestas, en caso contrario especifique la constraint directamente en la definicion del campo
			* FKC = Foreign Key Constraint
				En el caso de las FKC, debe agregarse el nombre de la tabla a la que la clave foranea hace referencia despues del de la tabla actual
			* UC = Unique Constraint
			* CC = Check Constraint
				Aparte del prefijo y la tabla de la CONSTRAINT, intenten ponerle un nombre lo mas descriptivo posible
		
		
*/

CREATE DATABASE IF NOT EXISTS Empresa;

USE Empresa;

CREATE TABLE IF NOT EXISTS Usuario(
	PK_nombreUsuario VARCHAR(100)
		PRIMARY KEY
		CHECK (PK_nombreUsuario != ""),
	clave VARCHAR(16)
		CHECK (clave != "")
);

CREATE TABLE IF NOT EXISTS Persona(
	PK_dni VARCHAR(50)
		PRIMARY KEY
		NOT NULL
		CHECK (PK_dni != ""),
	nombre VARCHAR(100)
		NOT NULL
		CHECK (nombre != ""),
	apellido VARCHAR(100)
		NOT NULL
		CHECK (apellido != ""),
	telefono VARCHAR(100)
		NOT NULL
		CHECK (telefono != ""),
	direccion VARCHAR(200)
		NOT NULL
		CHECK (direccion != ""),
	email VARCHAR(200)
		NOT NULL
		CHECK (email != ""),
	fechaNacimiento DATE
		NOT NULL
);

CREATE TABLE IF NOT EXISTS Cliente(
	PK_nombreEmpresa VARCHAR(100)
		PRIMARY KEY
		NOT NULL
		CHECK (PK_nombreEmpresa != ""),
	descripcion TEXT
		NOT NULL
		CHECK (descripcion != ""),
	direccion VARCHAR(200)
		NOT NULL
		CHECK (direccion != ""),
	FK_referenteDeContacto VARCHAR(50)
		NOT NULL
		CHECK (FK_referenteDeContacto != "")
	,
	CONSTRAINT FKC_Cliente_Persona_referenteDeContacto FOREIGN KEY (FK_referenteDeContacto) REFERENCES Persona(PK_dni)
) ;

CREATE TABLE IF NOT EXISTS Empleado(
	PK_FK_dniEmpleado VARCHAR(50)
		PRIMARY KEY
		CHECK (PK_FK_dniEmpleado != ""),
	area ENUM("Desarrollo", "Tecnica", "Comercial", "RRHH")
		NOT NULL,
	fechaIngreso DATE
		NOT NULL,
	maximosDiasVacacionales INT
		NOT NULL
		,
	FK_proyectoAsignado INT
		NULL
		,
	FK_usuarioAsociado VARCHAR(100)
		NOT NULL
		CHECK (FK_usuarioAsociado != ""), /* Validacion en trigger checkUserType */
	CONSTRAINT FKC_Empleado_Usuario_usuarioAsociado FOREIGN KEY (FK_usuarioAsociado) REFERENCES Usuario(PK_nombreUsuario),
	CONSTRAINT FKC_Empleado_Persona_persona FOREIGN KEY (PK_FK_dniEmpleado) REFERENCES Persona(PK_dni)
);

CREATE TABLE IF NOT EXISTS Propuesta(
	PK_idPropuesta INT
		PRIMARY KEY
		AUTO_INCREMENT,
	nombrePropuesta VARCHAR(100)
		NOT NULL
		CHECK (nombrePropuesta != ""),
	descripcionNecesidadCliente MEDIUMTEXT
		NOT NULL
		CHECK (descripcionNecesidadCliente != ""),
	restriccionTemporal DATE
		NOT NULL
		,
	restriccionEconomica DECIMAL(30, 2)
		NOT NULL
		,
	progreso ENUM("A estimar", "Enviar al cliente", "Enviado al cliente")
		NOT NULL
		DEFAULT ("A estimar")
		,
	estado ENUM("En progreso", "Aprobado", "Rechazado", "Observado")
		NOT NULL
		DEFAULT ("En progreso")
		,
	rutaPropuestaTecnica VARCHAR(1000)
		NULL
		CHECK (rutaPropuestaTecnica != "")
		,
	directorioArchivosPropuesta VARCHAR(1000)
		NOT NULL
		CHECK (directorioArchivosPropuesta != "")
		,
	FK_referenteDelCliente VARCHAR(50)
		NOT NULL
		CHECK (FK_referenteDelCliente != "")
		,
	FK_empresaCliente VARCHAR(100)
		NOT NULL
		CHECK (FK_empresaCliente != "")
		,
	FK_empleadoComercialAsociado VARCHAR(50)
		NOT NULL
        CHECK (FK_empleadoComercialAsociado != "")
		, /* Validacion en trigger checkEmployeeArea */
    FK_empleadoTecnicoAsociado VARCHAR(50)
        NULL
        CHECK (FK_empleadoTecnicoAsociado != "")
       , /* Validacion en trigger checkEmployeeArea */
	CONSTRAINT FKC_Propuesta_Persona_referenteDelCliente FOREIGN KEY (FK_referenteDelCliente) REFERENCES Persona(PK_dni),
	CONSTRAINT FKC_Propuesta_Cliente_empresaCliente FOREIGN KEY (FK_empresaCliente) REFERENCES Cliente(PK_nombreEmpresa),
	CONSTRAINT FKC_Propuesta_Empleado_empleadoComercialAsociado FOREIGN KEY (FK_empleadoComercialAsociado) REFERENCES Empleado(PK_FK_dniEmpleado),
	CONSTRAINT FKC_Propuesta_Empleado_empleadoTecnicoAsociado FOREIGN KEY (FK_empleadoTecnicoAsociado) REFERENCES Empleado(PK_FK_dniEmpleado),
	CONSTRAINT CC_Propuesta_sincronizarProgresoYEstado /* Mantiene la logica del negocio al prohibir ciertos valores excluyentes en el campo de progreso. Ej: una propuesta con estado 'Aprobado' debe tener progreso 'Enviado al cliente' */
		CHECK (IF(estado IN ("Aprobado", "Rechazado"), progreso LIKE "Enviado al cliente", TRUE/*No evaluar nada*/) IS TRUE),
	-- CONSTRAINT CC_Propuesta_sincronizarRutaYDirectorio /* El archivo de rutaPropuestaTecnica debe estar dentro del directorio especificado en directorioArchivosPropuesta */
	-- 	CHECK (rutaPropuestaTecnica LIKE CONCAT(directorioArchivosPropuesta, '%')),
	CONSTRAINT CC_Propuesta_restriccionEconomicaPositiva /* El campo restriccionEconomica no puede ser negativo ya que representa una suma de dinero */
		CHECK (restriccionEconomica >= 0),
    CONSTRAINT CC_Propuesta_validarRequisitosAprobacion /* Valida que los campos requeridos para la aprobacion de la propuesta no sea nulos */
        CHECK (IF(estado LIKE "Aprobado", (FK_empleadoTecnicoAsociado IS NOT NULL) AND (rutaPropuestaTecnica IS NOT NULL), TRUE /*No evaluar nada*/) IS TRUE)
) ;

CREATE TABLE IF NOT EXISTS Proyecto(
	PK_idProyecto INT
		PRIMARY KEY
		AUTO_INCREMENT,
	nombre VARCHAR(100)
		NOT NULL
		CHECK (nombre != ""),
	tipo ENUM("Proyecto", "Mantenimiento")
		NOT NULL,
	fechaInicio DATE
        DEFAULT (CURRENT_DATE())
		NOT NULL,
	fechaEntregaIdeal DATE
		NOT NULL,
	fechaEntregaReal DATE
		NULL,
	horasDisponibles INT
		NOT NULL
		,
	FK_responsableComercial VARCHAR(100)
		NOT NULL
		CHECK (FK_responsableComercial != ""),
	FK_responsableDeGestion VARCHAR(100)
		NOT NULL
		CHECK (FK_responsableDeGestion != ""),
	empleadosDisponibles INT
		NOT NULL
		,
	FK_propuestaAsociada INT
		NOT NULL
		, /* Validacion en trigger approvedProposal */
	rutaPlanDeTrabajo VARCHAR(1000)
		NOT NULL
		CHECK (rutaPlanDeTrabajo != ""), /* Validacion en trigger checkPath */
	presupuesto DECIMAL(30, 2)
		NOT NULL,
		/* Validacion en trigger enforceProposalConsistency */
	CONSTRAINT FKC_Proyecto_Empleado_responsableDeGestion FOREIGN KEY (FK_responsableDeGestion) REFERENCES Empleado(PK_FK_dniEmpleado),
	CONSTRAINT FKC_Proyecto_Empleado_responsableComercial FOREIGN KEY (FK_responsableComercial) REFERENCES Empleado(PK_FK_dniEmpleado),
	CONSTRAINT FKC_Proyecto_Propuesta_propuestaAsociada FOREIGN KEY (FK_propuestaAsociada) REFERENCES Propuesta(PK_idPropuesta),
	CONSTRAINT CC_Proyecto_empleadosDisponiblesMinimoDos /* Todo proyecto debe tener al menos 2 empleados disponibles, un responsable de gestion y un responsable comercial */
		CHECK (empleadosDisponibles >= 2)
    /* trigger con side effects updateEmpleado/Propuesta */
) ;

ALTER TABLE Empleado ADD CONSTRAINT FKC_Empleado_Proyecto_proyectoAsignado FOREIGN KEY (FK_proyectoAsignado) REFERENCES Proyecto(PK_idProyecto);

CREATE TABLE IF NOT EXISTS Tarea(
    PK_idTarea INT
        PRIMARY KEY
        AUTO_INCREMENT,
    nombreTarea VARCHAR(100)
        NOT NULL
        CHECK (nombreTarea != ""),
    FK_empleadoAsignado VARCHAR(50)
        NOT NULL
        CHECK (FK_empleadoAsignado != ""),
    FK_proyectoAsignado INT
        NOT NULL,
    cargaHoraria INT
        NOT NULL, /* validacion en trigger checkAvailableHours */
    completada BOOLEAN
        NOT NULL
        DEFAULT (FALSE)
        ,
    completadaPorEmpleado BOOLEAN
        NOT NULL
        DEFAULT (FALSE)
        ,
    descripcion TEXT
        NOT NULL,
    CONSTRAINT FKC_Tarea_Empleado_empleadoAsignado FOREIGN KEY (FK_empleadoAsignado) REFERENCES Empleado(PK_FK_dniEmpleado),
    CONSTRAINT FKC_Tarea_Empleado_proyectoAsignado FOREIGN KEY (FK_proyectoAsignado) REFERENCES Proyecto(PK_idProyecto)
);

CREATE TABLE IF NOT EXISTS Desvio(
	PK_idDesvio INT
		PRIMARY KEY
		AUTO_INCREMENT,
	fecha DATE
		NOT NULL
		DEFAULT (CURRENT_DATE()),
    nombreDesvio VARCHAR(100)
        NOT NULL
        CHECK (nombreDesvio != ""),
	costeEmpleadosDisponibles INT
		NOT NULL
		,
	costeHorasDisponibles INT
		NOT NULL
		,
	costePresupuesto DECIMAL(30, 2)
		NOT NULL
		,
	nuevaFechaEntrega DATE
		NOT NULL,
	FK_proyectoAsociado INT
		NOT NULL
		,
	/* Validacion en trigger updateProjectData */
	detalle MEDIUMTEXT
		NOT NULL
		CHECK (detalle != "")
		,
	CONSTRAINT FKC_Desvio_Proyecto_proyectoAsociado FOREIGN KEY (FK_proyectoAsociado) REFERENCES Proyecto(PK_idProyecto)
) ;


CREATE TABLE IF NOT EXISTS PeticionVacacion(
	PK_idPeticion INT
		PRIMARY KEY
		AUTO_INCREMENT,
	FK_empleado VARCHAR(50)
		NOT NULL
		CHECK (FK_empleado != ""),
    fechaInicio
        DATE
        NOT NULL,
	diasPedidos INT
		NOT NULL, /* Validacion en trigger validateVacationRequest */
    fechaFin DATE
        NOT NULL
        DEFAULT (DATE_ADD(fechaInicio, INTERVAL diasPedidos DAY)),
	estado ENUM("En observacion", "Aprobado", "Rechazado")
		NOT NULL
		DEFAULT ("En observacion"),
	CONSTRAINT FKC_PeticionVacacion_Empleado_empleado FOREIGN KEY (FK_empleado) REFERENCES Empleado(PK_FK_dniEmpleado)
);

/* todo M:N empleados propuesta, un empleado rechaza/acepta una o mas propuestas, una propuesta es rechazada por uno o mas empleados*/
CREATE TABLE `Empleado/Propuesta` (
    PK_surrogateKey INT
        PRIMARY KEY
        AUTO_INCREMENT,
    FK_empleado VARCHAR(50) /*Validacion en checkEmployeeArea*/
        NOT NULL
        CHECK (FK_empleado != ""),
    FK_propuesta INT
        NOT NULL,
    CONSTRAINT `UC_Empleado/Propuesta_naturalKey` UNIQUE (FK_empleado, FK_propuesta),
    CONSTRAINT `FKC_Empleado/Propuesta_Empleado_empleado` FOREIGN KEY (FK_empleado) REFERENCES Empleado(PK_FK_dniEmpleado),
    CONSTRAINT `FKC_Empleado/Propuesta_Propuesta_propuesta` FOREIGN KEY (FK_propuesta) REFERENCES Propuesta(PK_idPropuesta)
);
