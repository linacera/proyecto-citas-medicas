import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DoctorEntity } from '../doctor/doctor.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { HistorialEntity } from '../historial/historial.entity';

@Entity()
export class DetalleHistorialEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_detalle_historial',
    comment: 'Identificador de la tabla detalle historial'
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'fechaHistorial',
    comment: 'Fecha del historial'
  })
  fechaHistorial?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'sintomas',
    comment: 'Sintomas del paciente '
  })
  sintomas?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'signosVitales',
    comment: 'Signos vitales del paciente '
  })
  signosVitales?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'alergias',
    comment: 'Alergias del paciente '
  })
  alergias?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'antecedentesFamiliares',
    comment: 'antecedentesFamiliares del paciente '
  })
  antecedentesFamiliares?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'diagnostico',
    comment: 'Diagnostico del paciente '
  })
  diagnostico?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'medicamentos',
    comment: 'Medicamentos del paciente '
  })
  medicamentos?: string;

  @ManyToOne(
    type => DoctorEntity,
    doctor => doctor.detalles,
  )
  doctor: DoctorEntity;


  @ManyToOne(
    type => HistorialEntity,
    historial => historial.detalles,
  )
  historial: HistorialEntity;


}