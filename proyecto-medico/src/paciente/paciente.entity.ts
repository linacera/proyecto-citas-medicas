import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CitaEntity } from '../cita/cita.entity';
import { DetalleHistorialEntity } from '../detalle-historial/detalle-historial.entity';
import { HistorialEntity } from '../historial/historial.entity';

@Entity('paciente_proyecto')
export class PacienteEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_paciente',
    comment: 'Identificador de la tabla paciente'
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'nombre',
    comment: 'Nombre del paciente'
  })
  nombre?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'apellido',
    comment: 'Apellido del paciente'
  })
  apellido?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'fechaDeNacimiento',
    comment: 'Fecha de nacimiento del paciente'
  })
  fechaDeNacimiento?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'telefono',
    comment: 'telefono del paciente'
  })
  telefono?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'direccion',
    comment: 'direccion del paciente'
  })
  direccion?: string;

  @OneToMany(
    // tslint:disable-next-line:no-shadowed-variable
    type => CitaEntity, //Entidad
    cita => cita.paciente, //Nombre del campo
  )
  citas: CitaEntity[];

  @OneToOne(type => HistorialEntity, historial => historial.paciente)
  historial: HistorialEntity;


}