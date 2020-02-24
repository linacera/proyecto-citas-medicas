import { Column, Entity, Index, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HistorialEntity } from '../historial/historial.entity';
import { DoctorEntity } from '../doctor/doctor.entity';
import { PacienteEntity } from '../paciente/paciente.entity';


@Entity()
export class UsuarioEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_usuario',
    comment: 'Identificador de la tabla usuario'
  })
  id: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'nombreDeUsuario',
    comment: 'nombre del usuario'
  })
  nombreDeUsuario?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'contrasena',
    comment: 'contrasena'
  })
  contrasena?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'rol',
    comment: 'rol'
  })
  rol?: string;

  @OneToOne(type => DoctorEntity, doctor => doctor.usuario)
  doctor: DoctorEntity;

  @OneToOne(type => PacienteEntity, paciente => paciente.usuario)
  paciente: PacienteEntity;

}