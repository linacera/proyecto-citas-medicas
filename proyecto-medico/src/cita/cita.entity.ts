import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';
import { PacienteEntity } from '../paciente/paciente.entity';


@Entity('cita_proyecto')
export class CitaEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_doctor',
    comment: 'Identificador de la tabla cita'
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'fechaCita',
    comment: 'Fecha de la cita'
  })
  fechaCita?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'consultorio',
    comment: 'Numero del consultorio'
  })
  consultorio?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'estado',
    comment: 'Estado de la cita'
  })
  estado?: string;

  @ManyToOne(
    type => DoctorEntity,
    doctor => doctor.citas,
  )
  doctor: DoctorEntity;

  @ManyToOne(
    type => PacienteEntity,
    paciente => paciente.citas,
  )
  paciente: PacienteEntity;

}